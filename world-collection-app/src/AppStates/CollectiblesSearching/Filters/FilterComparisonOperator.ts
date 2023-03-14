export enum FilterComparisonOperator{
    GreaterThan = "Greater than (collectible`s property > selected time)",
    GreaterThanEqual = "Greater than and equals (collectible`s property >= selected time)",
    LessThan = "Less than (collectible`s property < selected time)",
    LessThanEqual = "Less than and equals (collectible`s property <= selected time)",
    InRange = "In certain range (selected time < collectible`s property < other selected time)",
    InRangeEqual = "In certain range (selected time <= collectible`s property <= other selected time)"
}