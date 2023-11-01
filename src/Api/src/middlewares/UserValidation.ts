import Joi from 'joi';

const register = Joi.object({
    name: Joi.string().max(30).required().regex(/^[a-zA-Z0-9_]+$/)
        .message("Name should only contain alphanumeric characters (letters, numbers, and underscores)"),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    tokenSpotify: Joi.string().required()
});

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export default { register, login };