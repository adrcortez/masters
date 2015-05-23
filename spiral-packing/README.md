# Spiral Packing
This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.


## Browser support

It is recommended to use either the latest versions of [Google Chrome](https://www.google.com/chrome/browser/desktop/) or
[Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/) to run the application.

## Installing NodeJS, Grunt, and bower
The application requires the installation of NodeJS, Grunt and Bower.

##### NodeJS
Download the appropriate [NodeJS](https://nodejs.org/download/) installer
for your system and run it.

##### Grunt
[Grunt](http://gruntjs.com/getting-started) is a command utility for running JavaScript tasks. Open a terminal window for OSX or Linux systems, or a command window if running Windows. Run the following command to install.
```
$ npm install -g grunt-cli
```

##### Bower
[Bower](http://bower.io/#install-bower) is a command line utility for managing frontend dependencies. Install it with npm.
```
$ npm install -g bower
```

## Build & development
The following commands will install the application dependencies.
```
$ npm install
$ bower install
```

To build and run the application run the following commands:
```
$ grunt less    // build the Less styles
$ grunt serve   // build the application and start the dev server
```

Run `grunt` for building and `grunt serve` for preview.


# Using the application

The application allows for two main operations:

1. Place seed spirals.
2. Place a child spiral.

To place a seed spirals, toggle on the _"ADD SEEDS"_ button then simply click on
the canvas area to place the seeds.

To branch a child spiral, first select a parent spiral by clicking on it. This
should outline the selected parent spiral. Next, toggle on the _"BRANCH"_ button.
A child spiral can then be placed by clicking on an empty area of the canvas.
The algorithm will attempt to fit a spiral branching from the selected spiral
in the direction of the click.

Spirals can also be deleted by selecting them and clicking the _"DELETE"_ button.
Keep in mind that this also deletes all of the spirals that branch from the
selected spiral.

The resulting image can then be exported by clicking on the _"SAVE IMAGE"_ button
and specifying a file name and export format in the modal.


### Options
The following options are available on the left pane of the applciation.

##### Parameters
These are the parameters of the spirals to draw. The user can modify the
number of turns (sweep), width per turn, and orientation (CW / CCW) of the
spirals. This updates as soon as one of the values are changed.

##### Behavior / Effects
These options control additional effects when drawing the spirals. The option
"Alternate orientation" forces the application to use the opposite orientation
of the parent spirals when placing child spirals. This is enabled by default,
since it tends to lead to better looking images.

When the "Flat colors" options is checked, the spirals will be drawn without
the glass (or slight depth) effect. The spiral colors will be flat. This is
checked by default since flat colors require less work to render.

##### Boundary Shapes
These are the preset boundary shapes to try to fit spirals to.

##### Colors
The color options for the application. Specifying multiple colors will cause the
application to blend the colors into a gradient that is applied along the
spiral path.

For convenience, the application provides multiple options for ccreating color schemes. The user can choose from the primary, secondary, or tertiary color sets or
choose a basis color and genenerate a color scheme using one of the predefined schemes (complementary, split-complementary, triadic, tetradic, monochromatic, or analogous). The user can also choose their own colors if they choose to not use a color set/scheme.

##### Metrics
The application displays a list of calculated metrics here to provide information to
the user as to the overall quality of the resulting image. The metrics are as follows:

- __A__ (_packing_) - The calculated area of the packed sprials.
- __A__ (_boundary_) - The calculated area of the boundary shape.
- __Porosity__ - The ratio of the empty space to the filled space. This is an indicator of the packing density. A smaller value means more packed.
- __Balance__ -  The vertical and horizontal balance of the packed area. This is calculated as the scaled difference between the area on both sides of a reflecting axis drawn through the centroid of the packing.
- __Color Harmony__ - A measure of how well the colors chosen for the image work together to produce a harmonious visual effect.
