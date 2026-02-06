import * as admin from 'firebase-admin';
import { Logger } from '@nestjs/common';

const logger = new Logger('FirebaseAdmin');

let firebaseAdminInitialized = false;

export function initializeFirebaseAdmin() {
  if (!firebaseAdminInitialized) {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
      return null;
    }

    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
        token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        universe_domain: 'googleapis.com',
      };
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        projectId: serviceAccount.project_id,
      });
      
      firebaseAdminInitialized = true;
      
      return admin;
    } catch (error) {
      return null;
    }
  }
  
  return admin;
}

export function getFirebaseAdmin() {
  return initializeFirebaseAdmin();
}

export function getMessaging() {
  const adminInstance = initializeFirebaseAdmin();
  if (!adminInstance) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  return adminInstance.messaging();
}

export function initializeFirebaseOnStartup() {
  return initializeFirebaseAdmin();
}