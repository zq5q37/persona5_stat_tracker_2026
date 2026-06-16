import clickSound from '../assets/sounds/persona_5_click.mp3';

const playClick = () => {
  const sound = new Audio(clickSound);
  sound.play();
};

export default playClick;