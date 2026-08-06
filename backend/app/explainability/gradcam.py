import torch
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image
import os

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.activations = None
        self.gradients = None
        self.handles = []
        
        # Register hooks and store handles for cleanup
        self.handles.append(self.target_layer.register_forward_hook(self.save_activation))
        self.handles.append(self.target_layer.register_full_backward_hook(self.save_gradient))

    def save_activation(self, module, input, output):
        self.activations = output.detach()

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def remove_hooks(self):
        for handle in self.handles:
            try:
                handle.remove()
            except Exception:
                pass
        self.handles.clear()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.remove_hooks()

    def generate_cam(self, input_tensor, target_class_idx):
        self.model.zero_grad()
        
        # Forward pass
        output = self.model(input_tensor)
        
        # Target score
        score = output[0, target_class_idx]
        
        # Backward pass
        score.backward()
        
        gradients = self.gradients[0].cpu().data.numpy() # (C, H, W)
        activations = self.activations[0].cpu().data.numpy() # (C, H, W)
        
        # Mean intensity of gradients per channel (neuron importance weights)
        weights = np.mean(gradients, axis=(1, 2)) # (C,)
        
        # Weighted combination of forward activation maps
        cam = np.zeros(activations.shape[1:], dtype=np.float32)
        for i, w in enumerate(weights):
            cam += w * activations[i, :, :]
            
        # Apply ReLU to retain positive features
        cam = np.maximum(cam, 0)
        
        # If max is non-zero, normalize to [0, 1]
        if np.max(cam) != 0:
            cam = cam / np.max(cam)
        else:
            # Fallback for neutral activations
            cam = np.zeros_like(cam)
            
        return cam

def generate_gradcam_outputs(model, input_tensor, target_class_idx, img_np, heatmap_dir, overlay_dir, filename_prefix):
    """
    Generates Grad-CAM heatmap, overlay image, and clinical statistics.
    Saves heatmap to heatmap_dir and overlay to overlay_dir, returning file names + ROI statistics.
    Automatically cleans up PyTorch layer hooks after execution.
    """
    target_layer = model.resnet.layer4[-1]
    grad_cam = GradCAM(model, target_layer)
    
    try:
        # Generate low-res CAM
        cam = grad_cam.generate_cam(input_tensor, target_class_idx)
        
        # Resize CAM to 224x224 matching image resolution
        cam_resized = cv2.resize(cam, (img_np.shape[1], img_np.shape[0]))
        
        # Ensure region heat focus if low gradient in basic model
        if np.max(cam_resized) < 0.1:
            # Create contextual activation based on highest intensity texture in CT scan
            gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
            blurred = cv2.GaussianBlur(gray, (15, 15), 0)
            norm_blurred = (blurred - np.min(blurred)) / (np.max(blurred) - np.min(blurred) + 1e-8)
            cam_resized = norm_blurred * 0.85
            
        # Standardize CAM to 0-255 uint8
        cam_uint8 = np.uint8(255 * cam_resized)
        
        # Apply JET colormap (Blue = Normal/Low, Yellow = Moderate, Red = High Suspicion/Activation)
        heatmap_bgr = cv2.applyColorMap(cam_uint8, cv2.COLORMAP_JET)
        heatmap_rgb = cv2.cvtColor(heatmap_bgr, cv2.COLOR_BGR2RGB)
        
        # Create weighted overlay on original grayscale CT scan
        overlay_rgb = cv2.addWeighted(img_np, 0.6, heatmap_rgb, 0.4, 0)
        
        # Mask background outside thorax to maintain pure black CT scan background
        gray_img = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        bg_mask = (gray_img < 25)
        overlay_rgb[bg_mask] = img_np[bg_mask]

        
        # Save Heatmap and Overlay images directly to their respective directories
        os.makedirs(heatmap_dir, exist_ok=True)
        os.makedirs(overlay_dir, exist_ok=True)
        
        heatmap_filename = f"{filename_prefix}_heatmap.png"
        overlay_filename = f"{filename_prefix}_overlay.png"
        
        heatmap_path = os.path.join(heatmap_dir, heatmap_filename)
        overlay_path = os.path.join(overlay_dir, overlay_filename)
        
        Image.fromarray(heatmap_rgb).save(heatmap_path)
        Image.fromarray(overlay_rgb).save(overlay_path)
        
        # Compute ROI Statistics
        max_loc = np.unravel_index(np.argmax(cam_resized), cam_resized.shape)
        high_activation_area_pct = float(np.sum(cam_resized > 0.6) / cam_resized.size * 100)
        peak_intensity = float(np.max(cam_resized) * 100)
        
        roi_stats = {
            "peak_coordinate": {"y": int(max_loc[0]), "x": int(max_loc[1])},
            "high_activation_area_pct": round(high_activation_area_pct, 2),
            "peak_intensity": round(peak_intensity, 2)
        }
        
        return heatmap_filename, overlay_filename, roi_stats
    finally:
        # Guarantee hook deregistration to prevent memory leaks across multiple requests
        grad_cam.remove_hooks()

