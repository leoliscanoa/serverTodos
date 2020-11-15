const app = require( './server/index' )
const supertest = require( 'supertest' )
const faker = require( 'faker' )
const request = supertest( app )
const { setup } = require( './server/setup' )
setup().then()
const url = '/api/categories'
let token, id
describe( 'TEST CATEGORIES', () => {
    describe( 'ADMIN USER', () => {
        it( 'Should login admin user successfully', async done => {
            const res = await request.post( '/api/users/sing/in' )
                .send( {
                    email   : 'user1@todos.com',
                    password: '123456789'
                } )
            expect( res.body.token ).toBeTruthy()
            token = res.body.token
            done()
        } )
        describe( 'GET /api/categories/unique/name?value', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/unique/name` )
                    .set( 'Authorization', null )
                    .query( {
                        value: faker.random.word()
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query param', async done => {
                const res = await request.get( `${ url }/unique/name` )
                    .set( 'Authorization', token )
                    .query( {
                        value: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query param', async done => {
                const res = await request.get( `${ url }/unique/name` )
                    .set( 'Authorization', token )
                    .query( {
                        value: faker.random.word()
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Available value' )
                done()
            } )
        } )
        describe( 'GET /api/categories/name', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }/name` )
                    .set( 'Authorization', null )
                    .query( {
                        search: faker.random.word(),
                        items : 10,
                        page  : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query param', async done => {
                const res = await request.get( `${ url }/name` )
                    .set( 'Authorization', token )
                    .query( {
                        search: null,
                        items : 10,
                        page  : 1
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query param', async done => {
                const res = await request.get( `${ url }/name` )
                    .set( 'Authorization', token )
                    .query( {
                        search: faker.random.word(),
                        items : 10,
                        page  : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Categories list by name' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                done()
            } )
        } )
        describe( 'POST /api/categories', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', null )
                    .send( {
                        name: faker.random.word( 'string' )
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        name: null
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid body', async done => {
                const res = await request.post( `${ url }` )
                    .set( 'Authorization', token )
                    .send( {
                        name: faker.random.word( 'string' )
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Category created successfully' )
                done()
            } )
        } )
        describe( 'GET /api/categories', () => {
            it( 'Should return http 401 at no Authorization', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', null )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 401 )
                expect( res.body.message ).toBe( 'Unauthorized access' )
                done()
            } )
            it( 'Should return http 400 at invalid query param', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: null,
                        page : 'abcdef'
                    } )
                expect( res.status ).toBe( 400 )
                expect( res.body.message ).toBe( 'Data integrity error' )
                done()
            } )
            it( 'Should return http 200 at valid query param', async done => {
                const res = await request.get( `${ url }` )
                    .set( 'Authorization', token )
                    .query( {
                        items: 10,
                        page : 1
                    } )
                expect( res.status ).toBe( 200 )
                expect( res.body.message ).toBe( 'Categories list' )
                expect( res.body.response.pagination ).toBeTruthy()
                expect( res.body.response.data ).toBeTruthy()
                id = res.body.response.data[0]._id
                done()
            } )
        } )
        describe( 'PUT /api/categories ' )
    } )
} )