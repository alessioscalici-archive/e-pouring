import { Measure } from './measure.model';

export class PourTick {
    inclination :number;
    isCorrectPosition :boolean;
}

export class PourStats {

    data :Array<PourTick>;
    openingTime :number;
    isGoodOpening :boolean;
    closingTime :number;
    isGoodClosing :boolean;
    totalTime :number;
    quantity :number;
    measure :Measure;
    bubbleHappened :boolean;
    wrongPositionTime :number;
    isTotalWrongPosition :boolean;
}