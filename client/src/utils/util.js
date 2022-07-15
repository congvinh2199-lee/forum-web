import moment from 'moment'
import lodash from 'lodash'

const hasNumber = (string) => {
  return /\d/.test(string)
}

const hasSpecicalCharacter = (string) => {
  return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string)
}


const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const isVietnamesePhoneNumber = (number) => {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

const dateTimeConverter = (dateTime) => {
  if (dateTime) {
    return moment(dateTime).format('DD-MM-YYYY');
  }
  return '';
};

const displayFacebooxVideo = (facebookId) => {
  return `https://www.facebook.com/watch?v=${facebookId}`
}

const displayYoutubeVideo = (youtubeId) => {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}

export {
  hasNumber,
  validateEmail,
  isVietnamesePhoneNumber,
  hasSpecicalCharacter,
  dateTimeConverter,
  displayFacebooxVideo,
  displayYoutubeVideo
}