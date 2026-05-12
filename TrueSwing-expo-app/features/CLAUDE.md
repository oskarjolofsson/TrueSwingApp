# FEATURES DIRECTORY

## What this folder is and layout
In here all logic and core features are written. In each feature-folder there are the following subfolders: 
- components - strictly design related
- utils - simple functions to store in other places than the components.
- hooks - Where states are stored. Try to keep the helper functions in utils
- screens - the files that are used in the routes, the `/app` directory

A flow-file might also be used, to determine which screen is showed at a given time


## Conventions
- Start all files with capital letters



## What to avoid
- To component files, no files should be longer than 200 lines