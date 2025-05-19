
export interface HeaderSurebet {
    percent: string;
    percent_color: string;
    sportName: string;
    home1: string;
    home2: string;
    period: string;
    middle_value: string;
    time: string;
}

export interface SectionSurebet {
    book_name: string;
    event_name: string;
    league_name: string;
    market: string;
    odds: string;
    arrowClass: string;
    score?: string;
    date_game?: string;
}

export interface Surebet {
    header: HeaderSurebet;
    sections: SectionSurebet[];
}

export interface DataFunctionCard {
    data: Surebet;
    setDataSelect: (data: Surebet) => void;
    setIsCalculated: (value: boolean) => void;
    setIsRemove: (value: boolean) => void;
}

export interface DataCalculator {
    data: Surebet;
    setIsCalculated: (value: boolean) => void;
}