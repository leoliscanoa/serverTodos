const mongoose = require( 'mongoose' )
const ObjectId = require( 'mongoose' ).Types.ObjectId

const categorySchema = new mongoose.Schema( {
    name  : {
        type     : String,
        min      : 1,
        max      : 255,
        trim     : true,
        required : true
    },
    status: {
        type   : Boolean,
        default: true
    },
    user  : {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : 'Users',
        required: true
    }
}, { timestamps: true } )

categorySchema.methods.uniqueCategoryName = async ( name, id = 'none', user ) => {
    const data = id === 'none' ? await mongoose.model( 'Categories', categorySchema, 'Categories' )
        .find( {
            name,
            user: ObjectId( user )
        } )
        .countDocuments() : await mongoose.model( 'Categories', categorySchema, 'Categories' )
        .find( {
            _id : { $ne: ObjectId( id ) },
            name,
            user: ObjectId( user )
        } )
        .countDocuments()
    return !data
}

categorySchema.methods.getCategoriesByUserId = async ( id, limit = 10, skip = 0 ) => {
    const total = await mongoose.model( 'Categories', categorySchema, 'Categories' )
        .find(
            {
                user: ObjectId( id )
            }
        )
        .countDocuments()
    const data = await mongoose.model( 'Categories', categorySchema, 'Categories' )
        .find(
            {
                user: ObjectId( id )
            },
            {
                _id: 1, name: 1, status: 1
            }
        )
        .skip( skip )
        .limit( limit )
    const pagination = { total, perPage: limit, pages: Math.ceil( total / limit ) }
    return { pagination, data }
}

categorySchema.methods.getCategoriesByUserIdByName = async ( id, search, limit = 10, skip = 0 ) => {
    const total = await mongoose.model( 'Categories', categorySchema, 'Categories' )
        .find(
            {
                user: ObjectId( id ),
                name: {
                    $regex: search
                }
            }
        )
        .countDocuments()
    const data = await mongoose.model( 'Categories', categorySchema, 'Categories' )
        .find(
            {
                user: ObjectId( id ),
                name: {
                    $regex: search
                }
            }
        )
        .skip( skip )
        .limit( limit )
    const pagination = { total, perPage: limit, pages: Math.ceil( total / limit ) }
    return { pagination, data }
}

categorySchema.methods.updateCategoryByIdByUserId = async ( id, user, name, status ) =>
    await mongoose.model( 'Categories', categorySchema, 'Categories' )
        .updateOne(
            {
                _id : ObjectId( id ),
                user: ObjectId( user )
            },
            {
                name, status
            }
        )

categorySchema.methods.updateCategoryStatusByIdByUserId = async ( id, user, status ) =>
    await mongoose.model( 'Categories', categorySchema, 'Categories' )
        .updateOne(
            {
                _id : ObjectId( id ),
                user: ObjectId( user )
            },
            {
                status
            }
        )

const Categories = mongoose.model( 'Categories', categorySchema, 'Categories' )
module.exports = Categories
