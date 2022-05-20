'use strict';

import { Cartographic, LabelStyle, Math } from 'cesium';

import MyPoint from './GeoPrimitives/MyPoint';

const convertSceneCoordinatesToCartesian = (pixels, viewer) =>
    viewer.camera.pickEllipsoid(pixels, viewer.scene.globe.ellipsoid);

const convertSceneCoordinatesToDegreesString = (pixels, viewer) => {
    const cartesian = convertSceneCoordinatesToCartesian(
        pixels,
        viewer
    );

    return convertCartesian2DegreesString(cartesian);
};

const convertCartographic2Cartesian = (carto) => {
    let result = null;

    let cartesian;

    if (carto) {
        const carto0 = new Cartographic(carto[0], carto[1]);

        cartesian = Cartographic.toCartesian(carto0);

        //result = [cartesian.longitude, cartesian.latitude];
    }

    return cartesian; // result;
};

const convertCartesian2Degrees = (cartesian) => {
    let result = null;

    if (cartesian) {
        const cartographic = Cartographic.fromCartesian(cartesian);

        if (cartographic)
            result = new MyPoint(
                Math.toDegrees(cartographic.longitude),
                Math.toDegrees(cartographic.latitude),
                cartographic.z
            );
    }

    return result;
};

const convertCartesian2DegreesString = (cartesian) => {
    let result = null;

    const degrees = convertCartesian2Degrees(cartesian);

    if (degrees) result = [degrees.x.toFixed(2), degrees.y.toFixed(2)];

    return result;
};

class point {
    constructor(x, y, z, coordsType) {
        this.coordX = x;
        this.coordY = y;
        this.z = z;
        this.coordsType = coordsType;
    }

    get x() {
        return this.coordX;
    }

    set x(val) {
        this.coordX = val;
    }

    get y() {
        return this.coordY;
    }

    set y(val) {
        this.coordY = val;
    }
}

export default {
    convertCartesian2Degrees,
    convertCartesian2DegreesString,
    convertSceneCoordinatesToCartesian,
    convertSceneCoordinatesToDegreesString,
    convertCartographic2Cartesian,
};