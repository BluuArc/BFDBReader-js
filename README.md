# BFDBReader-js
Web page to read data from a specific set of JSON files

# How to Use
1. Load the files.

  1. Using the 'Automatic' tab
  
    1. Pick a server and press 'Load URLs'.
    2. Press 'Load Files' once you're sure you are loading the databases of the correct server.
      * **NOTE:** This process may take a while before it finishes loading the data. Do not exit the page or click on anything until the text area in the 'Info JSON' page is filled.
    3. Press the 'Refresh Status' button to verify that everything is loaded properly.
  2. Using the 'Manual' tab
    * Use the 'Choose File' button to pick your info file or feskills/SP file.
    * Order of the files you choose don't matter as long as you use the correct file button for the info JSON and feskills/SP JSON files.
    * **NOTE:** This process may take a while before it finishes loading the data, especially for the info JSON. Do not exit the page or click on anything until the text area in the 'Info JSON' page is filled.
    * The status messages for this tab should update automatically.
2. Once you verify that the files have been loaded, click the 'Parse File(s)' button to fill the dropdown with unit names
  * **NOTE:** In the 'File Contents' area, clicking the SP JSON tab and back to the Info JSON tab may cause the page to seemingly freeze. Please do not exit the page until the text area loads; the freezing is due to having to reload the large amount of text data.
3. Find your desired unit and press the 'Print Info' button to display information about that unit across the various tabs.
  * The search works by replacing all the options that do not contain your search query with a dash, making it easier to see your search results while scrolling. To reset the drop down, simply clear the contents of the search box.
