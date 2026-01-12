export interface UserProfile {
    nombre: string;
    edad: number;
    sexo: 'Masculino' | 'Femenino' | 'Otro';
    condiciones: string[]; // Ej: Diabetes, Hipertensión
    alergias: string[];    // Ej: Penicilina, Glúten
    hasCompletedOnboarding: boolean;
}
