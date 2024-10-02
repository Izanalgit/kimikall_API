const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../app.js');

const {dbCreateUser, dbFindUser ,dbDeleteUser} = require('../services/userServices.js');
const {dbCreateProfile,dbDeleteProfile} = require('../services/profileServices.js');
const {saveToken,cleanToken} = require('../services/tokenServices.js');
const {genToken} = require('../utils/jwtAuth.js');


//Multer fuctions Mock
jest.mock('multer', () => {
    //Multer test response
    const multer = jest.fn(() => ({
        single: jest.fn(() => (req, res, next) => {
            req.file = { path: 'uploads/randomimage.jpg', originalname: 'randomimage.jpg' };
            next();
        }),
    }));

    //Test diskStorage
    multer.diskStorage = jest.fn(() => ({
        _handleFile: jest.fn(),
        _removeFile: jest.fn(),
    }));

    return multer;
});

// Cloudinary functions Mock
jest.mock('../services/imagesServices', () => ({
    uploadImage: jest.fn(() => Promise.resolve({ url: 'http://fake-url.com', publicId: 'fake-id' })),
    deleteImage: jest.fn(() => Promise.resolve(true)),
  }));

const agent = request.agent(app);

describe('TEST OF PROFILE END ROUTES',()=>{

    const user0 = {name:"Random22",email:"www.random@probe.com",pswd:"12wABCabc!"};
    const user1 = {name:"Jhon117",email:"www.spartan@probe.com",pswd:"12wABCabc!"};

    const bioToUpdate = {payload:{bio:'The master chief'}};

    let user0Id;
    let user1Id;
    
    let tokenAuth;

    beforeAll(async () => {
        await dbCreateUser(user0);
        await dbCreateUser(user1);

        const user0Obj = await dbFindUser(user0.email);
        const user1Obj = await dbFindUser(user1.email);

        user0Id = user0Obj._id;
        user1Id = user1Obj._id;

        tokenAuth = genToken(user0Id);
        
        await saveToken(user0Id,tokenAuth);
        await dbCreateProfile(user0Id);
        
    });
            
    it('BIO : Should upload bio to user profile', async ()=>{

        await agent
            .post('/api/profile/bio')
            .set('Authorization', tokenAuth)
            .send(bioToUpdate)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
                expect(res.body.updatedProfile.bio).toBe(bioToUpdate.payload.bio);
            })
    })

    it('GET : Should get the user profile',async ()=>{

        await agent
            .get('/api/profile')
            .set('Authorization', tokenAuth)
            .expect(200)
            .expect((res)=>{
                expect(res.body.userProfile).toBeDefined();
                expect(res.body.userProfile.bio).toBe(bioToUpdate.payload.bio);
            });
    })

    it('IMAGE : Should upload a profile image', async () => {
        const response = await agent
            .post('/api/profile/image/profile')
            .set('Authorization', tokenAuth)
            .attach('image', Buffer.from('randomimagecontent'), 'randomimage.jpg');
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
        expect(response.body.updatedProfile.profilePicture).toBe('http://fake-url.com');
    });


    //Server and DB connection closure
    afterAll(async () => {

        await dbDeleteUser(user0Id);
        await dbDeleteUser(user1Id);
        await cleanToken(user0Id);
        await dbDeleteProfile(user0Id);

        await mongoose.connection.close();
        server.close();
    });
})