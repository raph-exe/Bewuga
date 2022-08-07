# Bewuga
A desktop project to create beluga-like videos

# Installation & Setup

This project requires ffmpeg to generate videos, you can find static builds of ffmpeg [here](http://ffmpeg.org/).

The below line installs [electron](https://www.electronjs.org/) globally incase you do not already have it.

```
npm i electron -g
```

Use `npm i` in the directory to install all dependencies from `package.json`!

Once you have completed all the installation requirements you can run the project by using `electron .`

# Usage

Once the application has been launched you will see a blank area where all your frames (discord messages) for the video will be added!

Below you can find some simple controls for using the application

<table>
<tr>
<td>Ctrl + 1</td>
<td>Add a new message</td>
</tr>
<tr>
<td></td>
<td></td>
</tr>
<tr>
<td>Double Click (Message)</td>
<td>Delete a message</td>
</tr>
<tr>
<td></td>
<td></td>
</tr>
<tr>
<td>Ctrl + 2</td>
<td>Render Final Video</td>
</tr>
</table>

**Note: The audio of the final output is not properly synced with each frame of the video and this project is still prone to bugs**
