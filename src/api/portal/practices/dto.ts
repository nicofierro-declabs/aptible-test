export interface PracticeIn { 
    npi: string;
    practiceType: string;
    address: string;
    seats: number;
}

export interface SeatsOut {
    total: number;
    used: number;
}