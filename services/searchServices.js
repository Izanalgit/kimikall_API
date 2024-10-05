const User = require('../models/User');
const Profile = require('../models/Profile');
const ProfileExtended = require('../models/ProfileExtended');

//Find by search
async function searchProfiles(userId,filterSearch,advancedSearch){

    try{

        const userProfile = await Profile.findOne({userId});
        const userBlocks = await User.findById(userId,'blockedUsers')
        
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
        const location = filterSearch.closeSearch ? userProfile.location : null;

        //Filter object
        const filterObj = {
            userId:{$nin:userBlocks.blockedUsers},
            special:userProfile.special,
            orentation:userProfile.orentation,
            ...(genre && {genre}),
            age:{
                $gte:minAge,
                ...(maxAge && { $lte: maxAge })
            },
            ...(location && { location })
        }
        
        //Normal search profiles
        const profiles = await Profile.find(
            filterObj,
            'userId age genre orentation special location bio profilePicture'
        );
        
        // Block check
        const validProfiles = await Promise.all(profiles.map(async (profile) => {
            const profileUser = await User.findById(profile.userId, 'blockedUsers');
            return profileUser.blockedUsers.includes(userId) ? null : profile;
        }));

        const filteredProfiles = validProfiles.filter((profile) => profile !== null);

        // Add profile user name
        const userIds = filteredProfiles.map(profile => profile.userId);
        const users = await User.find({ _id: { $in: userIds } }, 'name');

        const profilesWithNames = filteredProfiles.map(profile => {
            const user = users.find((user) => user._id.equals(profile.userId));
            return { ...profile._doc, name: user ? user.name : '' };
        });

        if(!advancedSearch)
            return profilesWithNames;

        //Advanced filter object
        const extendedFilter = {
            userId : {$in: userIds},
            ...(advancedSearch.minHeight && { height: { $gte: advancedSearch.minHeight } }),
            ...(advancedSearch.maxHeight && { height: { $lte: advancedSearch.maxHeight } }),
            ...(advancedSearch.ethnia && { ethnia: advancedSearch.ethnia }),
            ...(advancedSearch.religion && { religion: advancedSearch.religion }),
            ...(advancedSearch.relationship && { relationship: advancedSearch.relationship }),
            ...(advancedSearch.smoking && { smoking: advancedSearch.smoking }),
            ...(advancedSearch.drinking && { drinking: advancedSearch.drinking }),
        }

        // Find extended profiles
        const extendedProfiles = await ProfileExtended.find(extendedFilter, 'userId');
        const extendedUserIds = extendedProfiles.map((profile) => profile.userId.toString());
 
        // Filter profiles that match extended search
        const finalProfiles = profilesWithNames.filter((profile) => 
            extendedUserIds.includes(profile.userId.toString()));
 
        return finalProfiles;

    }catch (err){
        console.error('ERROR : DB-SEARCH PROFILES : ',err);
        throw new Error ('can not search profiles');
    }
}

module.exports = {searchProfiles}