import Joi from 'joi';

export const fileSchema = Joi.object({
    filename: Joi.string().required(),
    url: Joi.string().uri().required(),
    fileType: Joi.string().required(), 
    size: Joi.number().greater(0).required(),
    user: Joi.string().hex().length(24).required(),  
});

