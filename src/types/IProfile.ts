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
    dob: Date;
    joiningDate: Date;
}
