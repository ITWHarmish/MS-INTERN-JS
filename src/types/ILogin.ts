
export interface Login {
    email: string;
    password: string;
}

export interface IProfile {
    email?: string;
    password?: string;
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    joiningDate?: Date;
    duration?: string;
    stream?: string;
    githubURL?: string;
    linkedinURL?: string;
    collegeName?: string;
    mentorId?: string;
    mentorFullName?: string;
    mentorEmail?: string;
    spaceId?: string;
    spreadId?: string;
    admin?: boolean;
}
