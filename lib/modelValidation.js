'use strict';

const 
     error_codes = require('./errorMessages').error_codes,
     Promise = require('bluebird');


exports.validateProperty = (Model, property) => {


    if (property == '_id') {
        return true;
    }
    return !(typeof Model.schema.obj[property] == 'undefined');
};




exports.getModelByProperty = (Model, property, value)=> {

    if (!property || !value) {
        return Promise.reject(error_codes.MissingFields); //MissingFields
    }

    if (this.validateProperty(Model, property)) {
        var query = {};
        query[property] = value;
        return Model.findOne(query).exec();
    }
    else {
        return Promise.reject(error_codes.ResourceNotValid); //ResourceNotValid
    }

};

