const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../app.js');

const {dbCreateUser, dbFindUser ,dbDeleteUser} = require('../services/userServices.js');
const {dbCreateProfile,dbUpdateProfile,dbDeleteProfile} = require('../services/profileServices.js');
const {dbCreateProfileExtended,dbUpdateProfileExtended,dbDeleteProfileExtended} = require('../services/profileExtendedServices.js');
const {saveToken,cleanToken} = require('../services/tokenServices.js');
const {genToken} = require('../utils/jwtAuth.js');

const agent = request.agent(app);

describe('TEST OF PROFILE SEARCH END ROUTE',()=>{

    const user0 = {name:"Random22",email:"www.random@probe.com",pswd:"12wABCabc!"};
    const user1 = {name:"Jhon117",email:"www.spartan@probe.com",pswd:"12wABCabc!"};
    const user2 = {name:"Cortana",email:"www.cortana@probe.com",pswd:"12wABCabc!"};
    const user3 = {name:"Covenant",email:"www.covenant@probe.com",pswd:"12wABCabc!"};
    const user4 = {name:"Covenant1",email:"www.covenant1@probe.com",pswd:"12wABCabc!"};
    const user5 = {name:"Covenant2",email:"www.covenant2@probe.com",pswd:"12wABCabc!"};

    const user0profile = {
        genre:'Hombre',
        orentation:'Hetero',
        special:['A'],
        location:'Madrid'
    }
    const user1profile = {
        profile:{
            genre:'Hombre',
            orentation:'Hetero',
            special:['A'],
            location:'Madrid'
        },
        extended:{
            height:200,
            ethnia:'Caucásico'
        }
    }
    const user2profile = {
        profile:{
            genre:'Mujer',
            orentation:'Hetero',
            special:['A'],
            location:'Madrid'
        },
        extended:{
            height:150,
            ethnia:'Asiática',
            smoking:true
        }
    }
    const user3profile = {
        profile:{
            genre:'Mujer',
            orentation:'Homo',
            special:['A'],
            location:'Madrid'
        },
        extended:{
            height:170,
            ethnia:'Caucásico',
            smoking:true
        }
    }
    const user4profile = {
        profile:{
            genre:'Mujer',
            orentation:'Hetero',
            special:['A'],
            location:'Zaragoza'
        },
        extended:{
            height:150,
            ethnia:'Caucásico',
            smoking:false
        }
    }
    const user5profile = {
        profile:{
            genre:'Mujer',
            orentation:'Hetero',
            special:['C'],
            location:'Zaragoza'
        },
        extended:{
            height:150,
            ethnia:'Caucásico',
            smoking:false
        }
    }

    const search0 = {payload:{normalSearch:{},expandedSearch:{}}};
    const search1 = {payload:{normalSearch:{location:true},expandedSearch:{maxHeight:160}}};
    const search2 = {payload:{normalSearch:{},expandedSearch:{ethnia:'Caucásico'}}};
    const search3 = {payload:{normalSearch:{},expandedSearch:{smoking:false}}};

    let user0Id;
    let user1Id;
    let user2Id;
    let user3Id;
    let user4Id;
    let user5Id;
    
    let tokenAuth;

    beforeAll(async () => {
        await dbCreateUser(user0);
        await dbCreateUser(user1);
        await dbCreateUser(user2);
        await dbCreateUser(user3);
        await dbCreateUser(user4);
        await dbCreateUser(user5);

        const user0Obj = await dbFindUser(user0.email);
        const user1Obj = await dbFindUser(user1.email);
        const user2Obj = await dbFindUser(user2.email);
        const user3Obj = await dbFindUser(user3.email);
        const user4Obj = await dbFindUser(user4.email);
        const user5Obj = await dbFindUser(user5.email);

        user0Id = user0Obj._id;
        user1Id = user1Obj._id;
        user2Id = user2Obj._id;
        user3Id = user3Obj._id;
        user4Id = user4Obj._id;
        user5Id = user5Obj._id;


        tokenAuth = genToken(user0Id);
        
        await saveToken(user0Id,tokenAuth);

        await dbCreateProfile(user0Id);
        await dbCreateProfile(user1Id);
        await dbCreateProfile(user2Id);
        await dbCreateProfile(user3Id);
        await dbCreateProfile(user4Id);
        await dbCreateProfile(user5Id);

        await dbCreateProfileExtended(user0Id);
        await dbCreateProfileExtended(user1Id);
        await dbCreateProfileExtended(user2Id);
        await dbCreateProfileExtended(user3Id);
        await dbCreateProfileExtended(user4Id);
        await dbCreateProfileExtended(user5Id);

        await dbUpdateProfile(user0Id,user0profile);

        await dbUpdateProfile(user1Id,user1profile.profile);
        await dbUpdateProfile(user2Id,user2profile.profile);
        await dbUpdateProfile(user3Id,user3profile.profile);
        await dbUpdateProfile(user4Id,user4profile.profile);
        await dbUpdateProfile(user5Id,user5profile.profile);

        await dbUpdateProfileExtended(user1Id,user1profile.extended);
        await dbUpdateProfileExtended(user2Id,user2profile.extended);
        await dbUpdateProfileExtended(user3Id,user3profile.extended);
        await dbUpdateProfileExtended(user4Id,user4profile.extended);
        await dbUpdateProfileExtended(user5Id,user5profile.extended);
    });
            
    it('SEARCH 1 : Should search all with compatibility', async ()=>{

        await agent
            .post('/api/contacts/search')
            .set('Authorization', tokenAuth)
            .send(search0)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.profiles).toBeDefined();
                expect(res.body.profiles.length).toBe(2);
            })
    })
    it('SEARCH 2 : Should search nearest profiles and less than 160 height', async ()=>{

        await agent
            .post('/api/contacts/search')
            .set('Authorization', tokenAuth)
            .send(search1)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.profiles).toBeDefined();
                expect(res.body.profiles.length).toBe(1);
            })
    })
    it('SEARCH 3 : Should search only caucasian profiles', async ()=>{

        await agent
            .post('/api/contacts/search')
            .set('Authorization', tokenAuth)
            .send(search2)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.profiles).toBeDefined();
                expect(res.body.profiles.length).toBe(1);
            })
    })
    it('SEARCH 4 : Should search only non smoker profiles', async ()=>{

        await agent
            .post('/api/contacts/search')
            .set('Authorization', tokenAuth)
            .send(search3)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.profiles).toBeDefined();
                expect(res.body.profiles.length).toBe(1);
            })
    })



   
    //Server and DB connection closure
    afterAll(async () => {

        await dbDeleteUser(user0Id);
        await dbDeleteUser(user1Id);
        await dbDeleteUser(user2Id);
        await dbDeleteUser(user3Id);
        await dbDeleteUser(user4Id);
        await dbDeleteUser(user5Id);

        await dbDeleteProfile(user0Id);
        await dbDeleteProfile(user1Id);
        await dbDeleteProfile(user2Id);
        await dbDeleteProfile(user3Id);
        await dbDeleteProfile(user4Id);
        await dbDeleteProfile(user5Id);

        await dbDeleteProfileExtended(user0Id);
        await dbDeleteProfileExtended(user1Id);
        await dbDeleteProfileExtended(user2Id);
        await dbDeleteProfileExtended(user3Id);
        await dbDeleteProfileExtended(user4Id);
        await dbDeleteProfileExtended(user5Id);

        await cleanToken(user0Id);

        await mongoose.connection.close();
        server.close();
    });
})