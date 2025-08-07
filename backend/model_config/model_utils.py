import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
from .model import Net  
from huggingface_hub import hf_hub_download, snapshot_download


# load the model. the model is cached locally after the first download
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_path = hf_hub_download(repo_id="izack8/mnist-handwritten-digits-recognition", filename="model.pth")

def load_model(path):
    model = Net().to(device)
    model.load_state_dict(torch.load(path, map_location=device))
    model.eval()
    print(f"Model loaded from {path}")
    return model

def predict(image: Image.Image):
    transform_no_normalize = transforms.Compose([
        transforms.Grayscale(num_output_channels=1), 
        transforms.Resize((28, 28)),                
        transforms.ToTensor()
    ])
    
    transform_with_normalize = transforms.Compose([
        transforms.Grayscale(num_output_channels=1), 
        transforms.Resize((28, 28)),                
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,)) 
    ])
    
    image_tensor_no_normalize = transform_no_normalize(image).unsqueeze(0).to(device)
    if image_tensor_no_normalize.sum() == 0:
        return {"prediction": "Blank canvas detected"}
    
    image_tensor = transform_with_normalize(image).unsqueeze(0).to(device)
    
    
    model = load_model(model_path)
    output = model(image_tensor)
    prediction = output.argmax(dim=1).item()
    return prediction

def train_model(model, train_loader, criterion, optimizer, num_epochs=5):
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {running_loss/len(train_loader):.4f}")
    print("Training complete.")

def save_model(model, path):
    torch.save(model.state_dict(), path)
    print(f"Model saved to {path}")


