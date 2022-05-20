'use strict';

import React, { useLayoutEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import regionOfInterest from './classes/GeoPrimitives/MyRegion';
import axios from 'axios';

//const sitesUrl = "https://shay-israel-maps.vercel.app/sites";
const sitesUrl = "http://localhost:5000/sites";

const CitiesComp = (props) => {
    const [city, setCity] = useState(0);
    const [mapCities, setMapCities] = useState(new Map());

    // TODO: to be fetched from db
    const cities = [{
            name: 'Petah Tikva',
            polygon: new regionOfInterest(34.86, 32.1, 34.9, 32.07).toPolygon(),
        },
        {
            name: 'Givat Shmuel',
            polygon: new regionOfInterest(34.85, 32.09, 34.86, 32.07).toPolygon(),
        },
        {
            name: 'Bnei Brak',
            polygon: new regionOfInterest(34.82, 32.1, 34.85, 32.07).toPolygon(),
        },
        {
            name: 'North',
            polygon: new regionOfInterest(33.9, 32.87, 35.55, 32.3).toPolygon(),
        },
        {
            name: 'Center',
            polygon: new regionOfInterest(33.9, 32.3, 35.55, 31.3).toPolygon(),
        },
        {
            name: 'South',
            polygon: new regionOfInterest(33.9, 31.3, 35.55, 29.5).toPolygon(),
        },
    ];

    //const getCitiesFromServerAsync = async () => await axios.get(sitesUrl);

    const getCitiesFromServer = () => {
        axios.get(sitesUrl).then(response => {
            //console.log(`data = ${JSON.stringify(data)}`);
            if ("data" in response) {
                const data = response.data;

                if (data && "sites" in data) {
                    const sites = data.sites;

                    if (Array.isArray(sites) && sites.length > 0) {
                        const adds = sites.map(s => {
                            const m = new Map();

                            m["name"] = s.name,
                                m["region"] = new regionOfInterest(33, 32, 24, 31);

                            return m;
                        });

                        cities.push(...adds);

                        initCities();
                    }
                }
            }
        });
    }

    const initCities = () => {
        const tempMap = new Map();

        for (let i = 0; i < cities.length; i++)
            tempMap.set(i + 1, cities[i]);

        setMapCities(tempMap);
    };

    useLayoutEffect(() => {
        //const sitesFromServer = getCitiesFromServer();

        initCities();

        setCity(mapCities.keys().next().value);
    }, []);

    const cityPicked = (pickedCity) => {
        if (pickedCity) {
            //const pickedCity = event.target.value;

            setCity(pickedCity.id);

            //const pCity = mapCities.get(pickedCity);

            props.callback(pickedCity.id, pickedCity.polygon);
        }
    };

    const getCitiesArray = () => {
        const arr = Array(mapCities.size).fill(null);

        let i = 0;

        for (let [key, value] of mapCities) {
            const city = value;

            city.id = key;

            arr[i++] = city;
        }

        return arr;
    };

    return ( <
            div style = {
                { marginLeft: '0%', marginTop: '60px' }
            } >
            <
            h3 > Choose a city < /h3> <
            Autocomplete options = { getCitiesArray() }
            getOptionLabel = {
                (option) =>
                option ? `(${option.id}) ${option.name}` : ''
            }
            onChange = {
                (event, value) => cityPicked(value)
            } // prints the selected value
            renderInput = {
                (params) => ( <
                    TextField inputProps = {
                        {
                            readonly: true,
                        }
                    } {...params }
                    label = "City"
                    variant = "outlined"
                    fullWidth /
                    >
                )
            }
            /> {
            /* <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={city}
                    label="City"
                    onChange={cityPicked}
                  >
                    {getCitiesArray().map((elem) => (
                      <MenuItem key={elem.id} value={elem.id}>
                        {`(${elem.id}) ${elem.name}`}
                      </MenuItem>
                    ))}
                  </Select> */
        } <
        /div>
);
};

export default CitiesComp;