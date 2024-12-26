import { IInputs, IOutputs } from "./generated/ManifestTypes";

// Define the main class for the CompressResizeImage control which implements the StandardControl interface
export class CompressResizeImage implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  // Declare private variables
  private _container: HTMLDivElement;
  private _notifyOutputChanged: () => void;
  private _fileInput: HTMLInputElement | null = null;
  private _imageData: string | undefined = undefined;
  private _compressionQuality: number = 0.7; // Default value for compression quality
  private _maxPixels: number = 800; // Default value for maximum pixels
  private _buttonBackgroundColor: string = "#4CAF50"; // Default background color for the button
  private _buttonTextColor: string = "white"; // Default text color for the button
  private _captureEnvironment: boolean = false;
  private _buttonTextSize: number = 16; // Default text size for the button
  private _buttonTextLabel: string = "Upload Image"; // Default text label for the button

  constructor() {}

  // Initialization method called when the control is created
  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
    this._container = container; // Store the container element
    this._notifyOutputChanged = notifyOutputChanged; // Store the notifyOutputChanged callback
    this._compressionQuality = context.parameters.compressionQuality.raw ?? 0.7; // Get compression quality from parameters or use default
    this._maxPixels = context.parameters.maxPixels.raw ?? 800; // Get max pixels from parameters or use default
    this._buttonBackgroundColor = context.parameters.buttonBackgroundColor.raw ?? "#4CAF50"; // Get button background color from parameters or use default
    this._buttonTextColor = context.parameters.buttonTextColor.raw ?? "white"; // Get button text color from parameters or use default
    this._captureEnvironment = context.parameters.captureEnvironment.raw ?? false; // Get capture environment from parameters or use default
    this._buttonTextSize = context.parameters.buttonTextSize.raw ?? 16; // Get button text size from parameters or use default
    this._buttonTextLabel = context.parameters.buttonTextLabel.raw ?? "Upload Image"; // Get button text label from parameters or use default

    this.render(); // Render the control
  }

  // Render method to create and display the control elements
  private render(): void {
    this._container.innerHTML = ""; // Clear the container

    // Create a container div with styling
    const containerDiv = document.createElement("div");
    containerDiv.style.position = "relative";
    containerDiv.style.width = "100%";
    containerDiv.style.height = "100%";
    containerDiv.style.display = "flex";
    containerDiv.style.flexDirection = "column";
    containerDiv.style.alignItems = "center";
    containerDiv.style.justifyContent = "center";

    // Create the capture button with an embedded SVG icon and styles
    const captureButton = document.createElement("button");
    captureButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="` + this._buttonTextSize + "px" + `" height="` + this._buttonTextSize + "px" + `";">
        <path fill="` + this._buttonTextColor + `" d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/>
      </svg>
      ` + this._buttonTextLabel; // Add the SVG icon and text label to the button
    captureButton.style.padding =  this._buttonTextSize + "px";
    captureButton.style.fontSize = this._buttonTextSize + "px";
    captureButton.style.backgroundColor = this._buttonBackgroundColor;
    captureButton.style.color = this._buttonTextColor;
    captureButton.style.border = "none";
    captureButton.style.borderRadius = "5px";
    captureButton.style.cursor = "pointer";
    captureButton.style.display = "flex";
    captureButton.style.alignItems = "center";
    captureButton.style.gap = this._buttonTextSize/2 + "px";
    captureButton.style.fontFamily = "Arial, sans-serif"; // Force font to Arial
    captureButton.onclick = this.captureImage.bind(this); // Bind the click event to the captureImage method

    // Create a hidden file input element for capturing images
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    if (this._captureEnvironment) { fileInput.capture = "environment" } // Only add capture attribute if _captureEnvironment is true
    fileInput.style.display = "none";
    fileInput.onchange = this.handleFileChange.bind(this);
    this._fileInput = fileInput;

    // Append the file input and capture button to the container div
    containerDiv.appendChild(fileInput);
    containerDiv.appendChild(captureButton);

    // Append the container div to the main container
    this._container.appendChild(containerDiv);
  }

  // Method to simulate a click on the hidden file input element
  private captureImage(): void {
    if (this._fileInput) {
      this._fileInput.click();
    }
  }

  // Method to handle the file input change event
  private async handleFileChange(event: Event): Promise<void> {
    console.log("File change event triggered");
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const resizedImage = await this.resizeAndCompressImage(file); // Resize and compress the image
      this.convertBlobToBase64(resizedImage); // Convert the image blob to Base64
    }
  }

  // Method to resize and compress the image
  private resizeAndCompressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          let width = img.width;
          let height = img.height;

          // Adjust the dimensions to fit within the specified maxPixels
          if (width > height) {
            if (width > this._maxPixels) {
              height *= this._maxPixels / width;
              width = this._maxPixels;
            }
          } else {
            if (height > this._maxPixels) {
              width *= this._maxPixels / height;
              height = this._maxPixels;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Image compression failed."));
          }, "image/jpeg", this._compressionQuality); // Compress the image
        };
      };
      reader.readAsDataURL(file);
    });
  }

  // Method to convert the image blob to Base64 format
  private convertBlobToBase64(blob: Blob): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this._imageData = reader.result as string; // Store the Base64 string
      this._notifyOutputChanged(); // Notify that the output has changed
    };
    reader.readAsDataURL(blob);
  }

  // Method to update the view when the control parameters change
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._compressionQuality = context.parameters.compressionQuality.raw ?? this._compressionQuality;
    this._maxPixels = context.parameters.maxPixels.raw ?? this._maxPixels;
    this._buttonBackgroundColor = context.parameters.buttonBackgroundColor.raw ?? this._buttonBackgroundColor;
    this._buttonTextColor = context.parameters.buttonTextColor.raw ?? this._buttonTextColor;
    this._captureEnvironment = context.parameters.captureEnvironment.raw ?? this._captureEnvironment;
    this._buttonTextSize = context.parameters.buttonTextSize.raw ?? this._buttonTextSize;
    this._buttonTextLabel = context.parameters.buttonTextLabel.raw ?? this._buttonTextLabel;
    this.render();
  }

  // Method to get the outputs of the control
  public getOutputs(): IOutputs {
    return { imageData: this._imageData };
  }

  // Method to clean up when the control is destroyed
  public destroy(): void {
    this._container.innerHTML = "";
  }
}