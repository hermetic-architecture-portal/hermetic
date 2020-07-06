# Hermetic Help

This folder contains the online help for the Hermetic web application.  

* The source help content (markdown files and images) is stored under the ```help_src``` folder.
* The ```npm run build``` command combines the markdown files into a single file, converts it to HTML, wraps it with ```help_template/template.html``` and outputs to the ```build``` folder.
* The markdown files are ordered based on the assumption their file names start with a number, followed by a full-stop and a space.  The number is used for ordering.
* The Hermetic web application sends users to the help content with an anchor based on the current menu item.  If you would like the users to be sent to the appropriate section in the help content you can either:
    * Have a section heading that auto-generates the correct anchor (e.g. a section heading ```# Technology Reference Model``` generates the anchor ```technology-reference-model```)
    * Manually add an anchor tag to the help content (e.g. ```<a name="edit-network-nodes"/>```)
* Note that there is no security trimming in the help - all users can view all help regardless of their permissions level.  Ensure you do not include any sensitive information in screenshots etc.
* Images can be included by saving them under ```help_src/img``` and adding an image tag to the help content like ```<img src="img/screenshot-brm.png" />```

## Customisations

* The help CSS theme can be customised in the same way as the web client theme - by providing an environment variable ```HERMETIC_CUSTOM_SASS_PATH``` which points to a folder containing a CustomVariables.scss file.  You can use the same file as you use for the main client.
* The recommended way to display custom content is to set up your own help folder and use the ```HERMETIC_HELP_FILES_PATH``` environment variable to point the server to it.