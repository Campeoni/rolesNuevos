import userModel from "../models/MongoDB/user.js";

export const findUsers = async () => {
    try {
        const users = await userModel.find()
        return users
    } catch (error) {
        throw new Error(error)
    }
}

export const findUserById = async (uid) => {
    try {
        const user = await userModel.findById(uid)
        return user
    } catch (error) {
        throw new Error(error)
    }
}

export const findUserByEmail = async (email) => {
    try {
        const user = await userModel.findOne({ email: email })
        return user
    } catch (error) {
        throw new Error(error)
    }
}

export const createUser = async (user) => {
    try {
        const newUser = await userModel(user)
        await newUser.save()
        return newUser
    } catch (error) {
        throw new Error(error)
    }
}