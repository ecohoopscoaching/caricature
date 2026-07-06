
import { CaricatureStyle, StyleConfig } from './types';

export const STYLE_CONFIGS: Record<CaricatureStyle, StyleConfig> = {
  [CaricatureStyle.EGO_DISTORTER]: {
    id: CaricatureStyle.EGO_DISTORTER,
    name: 'The Ego Distorter',
    description: 'Hyper-Realistic Absurdity: Massive expressions and pores you can see from space.',
    prompt: 'Generate an extremely funny and hyper-realistic caricature of this person. Exaggerate their facial features to an absurd, comedic scale—think giant nose, tiny ears, massive chin, and wildly bulging eyes. Maintain high-resolution skin details, pores, and realistic textures, but apply massive, funny distortion to the skeletal structure. The goal is "uncomfortably detailed comedy."',
    icon: '🤪'
  },
  [CaricatureStyle.LEGEND_CANVAS]: {
    id: CaricatureStyle.LEGEND_CANVAS,
    name: 'The Legend Canvas',
    description: 'The Comedic King: 90s rap poster vibes with 200% more swagger and absurd proportions.',
    prompt: 'Transform this person into a funny 90s rap poster legend. Style: Digital painterly realism with smooth oil brush textures and dramatic lighting. Comedically exaggerate their expression and features—give them an absurdly confident "boss" look with a giant head and tiny body. Include funny, oversized accessories like a massive gold chain or a tilted crown. Larger-than-life parody.',
    icon: '👑'
  },
  [CaricatureStyle.VECTOR_VAULT]: {
    id: CaricatureStyle.VECTOR_VAULT,
    name: 'The Vector Vault',
    description: 'Cartoon Chaos: Saturday morning energy with eyes that pop and jaws that drop.',
    prompt: 'Convert this portrait into a wacky, Saturday morning cartoon vector illustration. Use crisp lines, flat cell shading, and a bold color palette. Distort the face into a wild, funny expression—eyes bugging out, tongue hanging out, or ears flapping. Pure cartoon chaos with sharp contours and expressive, simplified, yet wildly exaggerated shapes.',
    icon: '⚡'
  }
};
