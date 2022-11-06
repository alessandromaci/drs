let profile;

export let setProfile = (profileData) => {
  profile = profileData;
  console.log(profile);
};

export let getProfile = () => {
  return profile;
};
