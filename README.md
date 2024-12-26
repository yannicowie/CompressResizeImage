# CompressResizeImage

## Overview

`CompressResizeImage` is a custom PCF (PowerApps Component Framework) component that can resize and compress images directly within a Canvas PowerApp. All image processing happens very fast, locally on the device. Features included are:

- Specify the amount of JPG compression you want to apply to captured images

- Specify the maximum pixel dimensions for the long side of the image

- Cutomise the size and colour of the image capture component button

- Specify whether the camera opens directly when the user selects the image capture button, or whether they should be prompted to choose between uploading from gallery or taking a new photo

## Why I built this component
I built this component to help with a project where a large number of images needed to be captured in a Canvas PowerApp. I found that in the field, many modern devices would capture large image files, many MBs in size, which could take a while to upload over a poor mobile data connection. Additionally, these image files would consume a significant amount of storage space on the destination medium. However, the image quality of these large files taken straight from the device was far beyond what was necessary. By specifying the maximum image dimensions and the amount of JPG compression to apply, images of a more predictable and manageable file size are obtained.

## How to Import
-   Make sure you have  [PCF components enabled](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/component-framework-for-canvas-apps#enable-the-power-apps-component-framework-feature)  in your environment.

-   Download the latest [managed solution](https://github.com/yannicowie/CompressResizeImage/releases)  and import it into your environment.

-   [Add the component](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/component-framework-for-canvas-apps#add-components-to-a-canvas-app)  to your canvas app.

## Properties
Once you've added the component to your app, you need to configure its properties:

| Property  | Description  |  Example Value |
|---|---|---|
| `imageData`  | Outputs a Base64 string of the compressed and resized image  |   |
| `compressionQuality` | JPEG compression quality (0.0 to 1.0)  | 0.6 |
| `maxPixels`  | Maximum dimension in pixels for the long side of the image  | 800  |
| `buttonBackgroundColor` | Background color of the upload button | #4CAF50 |
| `buttonTextColor` | Text color of the upload button | #FFFFFF |
| `captureEnvironment` | If true, the camera will open directly for photo capture. Otherwise, the user can choose to upload an existing image from their device, or take a new on using the camera | false |
