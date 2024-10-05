const User = require('../models/User');
const Profile = require('../models/Profile');

const blockCheck = require('../utils/blockCheck');

//Find by search
async function searchProfiles(userId,filterSearch){

    try{

        const userProfile = await Profile.findOne(userId);
        
        //Genre preselection
        let genre;

        if(userProfile.orentation === 'Otro') genre = null;

        if(userProfile.orentation === 'Homo') genre = userProfile.genre;
        
        if(userProfile.orentation === 'Hetero')
            genre = userProfile.genre === 'Hombre'?'Mujer':'Hombre';

        //Age filter
        const minAge = filterSearch.minAge || 18;
        const maxAge = filterSearch.maxAge || null;

        //Location filter
        const location = filterSearch.closeSearch?
            userProfile.location:
            null;

        //Filter object
        const filterObj = {
            special:userProfile.special,
            orentation:userProfile.orentation,
            ...(genre && {genre}),
            age:{
                $gte:minAge,
                ...(maxAge && { $lte: maxAge })
            },
            ...(location && { location })
        }
    
        const profiles = await Profile.find(
            filterObj,
            'userId age genre orentation special location bio profilePicture'
        );
        
         // Block check
         const validProfiles = await Promise.all(profiles.map(async (profile) => {
            const block = await blockCheck(userId, profile.userId);
            return block ? null : profile;
        }));

        const filteredProfiles = validProfiles.filter((profile) => profile !== null);

        // Add profile user name
        const userIds = filteredProfiles.map(profile => profile.userId);
        const users = await User.find({ _id: { $in: userIds } }, 'name');

        const profilesWithNames = filteredProfiles.map(profile => {
            const user = users.find((user) => user._id.equals(profile.userId));
            return { ...profile._doc, name: user ? user.name : '' };
        });

        return profilesWithNames;

    }catch (err){
        console.error('ERROR : DB-SEARCH PROFILES : ',err);
        throw new Error ('can not search profiles');
    }
}

module.exports = {searchProfiles}