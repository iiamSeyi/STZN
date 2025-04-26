import { ValidationError } from './errors';

export function validateProfileUpdates(updates) {
  const allowedFields = ['displayName', 'photoURL', 'email'];
  const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
  
  if (invalidFields.length > 0) {
    throw new ValidationError(`Invalid profile fields: ${invalidFields.join(', ')}`);
  }
  
  if (updates.displayName && typeof updates.displayName !== 'string') {
    throw new ValidationError('Display name must be a string');
  }
  
  if (updates.email && typeof updates.email !== 'string') {
    throw new ValidationError('Email  must be a string'); 
  }
  
  if (updates.email && !updates.email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }
  
  return true;
}

export function validateUserData(user) {
  if (!user.uid) throw new ValidationError('User ID is required');
  if (!user.email) throw new ValidationError('User email is required');
  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }
  return true;
}

export function validatePastQuestionData(questionData) {
    if (!questionData.title) throw new ValidationError('Title is required');
    if (!questionData.course) throw new ValidationError('Course is required');
    if (!questionData.year) throw new ValidationError('Year is required');
    if (!questionData.userId) throw new ValidationError('User ID is required');
    if (!questionData.imageUrl) throw new ValidationError('File URL is required');
    return true;
  }
  
  export function validatePastQuestionMetadata(metadata) {
    if (!metadata.title) throw new ValidationError('Title is required');
    if (!metadata.course) throw new ValidationError('Course is required');
    if (!metadata.year) throw new ValidationError('Year is required');
    return true;
  }
  
  export function validatePastQuestionUpdates(updates) {
    const allowedFields = ['title', 'course', 'year', 'imageUrl', 'updatedAt'];
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      throw new ValidationError(`Invalid past question update fields: ${invalidFields.join(', ')}`);
    }
    
    if (updates.title && typeof updates.title !== 'string') {
      throw new ValidationError('Title must be a string');
    }
    
    if (updates.course && typeof updates.course !== 'string') {
      throw new ValidationError('Course must be a string');
    }
    
    if (updates.year && typeof updates.year !== 'string') {
      throw new ValidationError('Year must be a string');
    }
  
    if (updates.imageUrl && typeof updates.imageUrl !== 'string') {
      throw new ValidationError('Image URL must be a string');
    }
  
    return true;
  }
  