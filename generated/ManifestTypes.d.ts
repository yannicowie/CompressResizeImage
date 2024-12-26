/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    imageData: ComponentFramework.PropertyTypes.StringProperty;
    compressionQuality: ComponentFramework.PropertyTypes.FloatingNumberProperty;
    maxPixels: ComponentFramework.PropertyTypes.WholeNumberProperty;
    buttonBackgroundColor: ComponentFramework.PropertyTypes.StringProperty;
    buttonTextColor: ComponentFramework.PropertyTypes.StringProperty;
    captureEnvironment: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    buttonTextSize: ComponentFramework.PropertyTypes.WholeNumberProperty;
    buttonTextLabel: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    imageData?: string;
}
