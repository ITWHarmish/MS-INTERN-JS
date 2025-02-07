export interface IProfileHeaderProps {
    editMode: boolean
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    handleSave: () => void
}

export interface IProfileForm {
    fullName: string;
    duration: string;
    stream: string;
    phoneNumber: string;
    address: string;
    githubURL: string;
    linkedinURL: string;
    hrEmail: string;
    hrFullName: string;
    mentorEmail: string;
    mentorFullName: string;
    dob?: string;
    joiningDate: string;
    collegeName: string;
}

export interface IProfileUpdate {
    fullName?: string;
    internsDetails: {
        stream: string;
        phoneNumber: string;
        address: string;
        collegeName: string;
        githubURL: string;
        linkedinURL: string;
        duration: string;
        joiningDate: string;
    };
}