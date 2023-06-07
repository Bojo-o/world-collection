import { useEffect, useState } from "react"
import { DateWithPrecision } from "../../Data/TimeModels/DateWithPrecision";

import { Collectible } from "../../Data/DatabaseModels/Collectible";
import { DATEOPTIONS } from "../../Data/Enums/DateOption";
import { LocalAPIProxy } from "../../API/LocalAPIProxy";
import LoadingStatus from "../../Gadgets/LoadingStatus";
import { DatePrecision } from "../../Data/Enums/DatePrecision";


/**
 * Props necessary for Visitation.
 */
export interface VisitationProps {
    /** Collectible, for which is visitation edited. */
    collectible: Collectible;
    /** Func, which updates visitation. Notify parent component about updating visitation.*/
    updateVisitation: (isVisited: boolean, dateFrom: DateWithPrecision | null, dateTo: DateWithPrecision | null) => void;
}
/**
 * Renders component for editing date of visit of collectible.
 * It offers to the user checkbox represetning if given collectible has been visited by user,various possibilities how to set date of visit.
 * It also contains mechanism for invoking DatabaseAPI to save date of visit.
 * @param VisitationProps See VisitationProps description.
 * @returns JSX element rendering whole Visitation.
 */
function Visitation({ collectible, updateVisitation }: VisitationProps) {
    enum Date {
        Date = "date",
        Month = "month"
    }

    const [isVisited, setIsVisited] = useState(collectible.isVisit)

    const [saving, setSaving] = useState(false);
    const [savingError, setSavingError] = useState(false);
    const [savingStatus, setSavingStatus] = useState<string | null>(null)

    const [todayDate] = useState(new DateWithPrecision(null, DatePrecision.Day));
    const [dateFrom, setDateFrom] = useState<DateWithPrecision | null>(null);
    const [dateTo, setDateTo] = useState<DateWithPrecision | null>(null);
    const [year, setYear] = useState(todayDate.getYear());
    const [dateOption, setDateOption] = useState<DATEOPTIONS>(DATEOPTIONS.Date);

    const handleChangeOfVisitationCheckbox = (e: any) => {

        if (e.target.checked) {
            setIsVisited(true)
        } else {
            setIsVisited(false)
        }

    }
    /**
     * Calls DatabaseAPI to save visitation of collectible.
     */
    const handleSave = () => {
        setSaving(true);
        setSavingError(false);
        setSavingStatus(null);

        LocalAPIProxy.setCollectibleVisitation(collectible.QNumber, isVisited, (dateFrom == null) ? null : dateFrom.getPrecision().toString(), dateFrom, dateTo).then((status) => {
            setSaving(false);
            setSavingStatus(status);

            updateVisitation(isVisited, dateFrom, dateTo);
        }).catch(() => {
            setSavingError(true);
        })

    }
    const handleDateFrom = (e: any, precision: DatePrecision) => {
        setDateFrom(new DateWithPrecision(e.target.value, precision));
    }
    const handleDateTo = (e: any, precision: DatePrecision) => {
        setDateTo(new DateWithPrecision(e.target.value, precision));
    }

    const renderDateInput = (type: Date, label: string, handleDate: (e: any, precision: DatePrecision) => void, max: DateWithPrecision | null = null, min: DateWithPrecision | null = null) => {
        return (
            <>
                <label htmlFor={type}>{label}</label>
                <input className="form-control" type={type} id={type} name={type}
                    max={(max === null) ? undefined : (type === Date.Date) ? max.getDate() : max.getMonthYear()}
                    min={(min === null) ? undefined : (type === Date.Date) ? min.getDate() : min.getMonthYear()}
                    onChange={(e: any) => handleDate(e, (type === Date.Date) ? DatePrecision.Day : DatePrecision.Month)} />
            </>
        )
    }

    const handleYear = (e: any) => {
        let year = e.target.value;
        if (year <= Number(todayDate.getYear()) && year > 1900) {
            setYear(year);
            setDateFrom(new DateWithPrecision(e.target.value + "-01", DatePrecision.Year));
        }
    }
    const renderYearInput = () => {
        return (
            <>
                <label htmlFor='year'>Year of visit</label>
                <input className="form-control" type="number" id={"year"} name={'year'} min="1900" max={todayDate.getYear()} step="1" value={year} onChange={handleYear} />
            </>
        )
    }
    const handleDateSelection = (e: any) => {
        let value: string = e.target.value;
        setDateOption(DATEOPTIONS[value as keyof typeof DATEOPTIONS])
    }
    useEffect(() => {
        setDateFrom(null)
        setDateTo(null)
        if (dateOption === DATEOPTIONS.Year) {
            setDateFrom(new DateWithPrecision(todayDate.getYear() + "-01", DatePrecision.Year));
        }
    }, [dateOption,todayDate])
    return (
        <>
            <div data-testid="visitation container" className="d-flex flex-column">
                <div>
                    {isVisited ? (<input type="checkbox" id="visition" name="visition" onChange={handleChangeOfVisitationCheckbox} checked />) : (<input type="checkbox" id="visition" name="visition" value="Visited" onChange={handleChangeOfVisitationCheckbox} />)}
                    <label htmlFor="visition">Visited this place? </label>
                </div>

                {isVisited == true && (
                    <>
                        <p>Set date of visit:</p>
                        <p>Select date format you want to use</p>
                        <select className='form-select' aria-label='Date selection' onChange={handleDateSelection}>
                            {Object.entries(DATEOPTIONS).map((d, index) => {
                                return (
                                    <option key={index} value={d[0]}>{d[1]}</option>
                                )
                            })}

                        </select>

                        {dateOption === DATEOPTIONS.Date && (
                            <>
                                {renderDateInput(Date.Date, "Date of visit", handleDateFrom, todayDate)}
                            </>
                        )}
                        {dateOption === DATEOPTIONS.Month && (
                            <>
                                {renderDateInput(Date.Month, "Month of visit", handleDateFrom, todayDate)}
                            </>
                        )}
                        {dateOption === DATEOPTIONS.Year && (
                            <>
                                {renderYearInput()}
                            </>
                        )}
                        {dateOption === DATEOPTIONS.RangeInDate && (
                            <>
                                <h3>Date of visit</h3>
                                {renderDateInput(Date.Date, "Visit from", handleDateFrom, (dateTo != null) ? dateTo : todayDate)}
                                <br />
                                {renderDateInput(Date.Date, "Visit to", handleDateTo, todayDate, (dateFrom != null) ? dateFrom : null)}
                            </>
                        )}
                        {dateOption === DATEOPTIONS.RangeInMonth && (
                            <>
                                <h3>Month of visit</h3>
                                {renderDateInput(Date.Month, "Visit from", handleDateFrom, (dateTo != null) ? dateTo : todayDate)}
                                <br />
                                {renderDateInput(Date.Month, "Visit to", handleDateTo, todayDate, (dateFrom != null) ? dateFrom : null)}
                            </>
                        )}
                        {(dateOption === DATEOPTIONS.RangeInDate || dateOption === DATEOPTIONS.RangeInMonth) ? (
                            <>
                                {dateFrom != null && (
                                    <>
                                        <p>Setted date from: {dateFrom.ToString()}</p>
                                    </>
                                )}
                                {dateTo != null && (
                                    <>
                                        <p>Setted date to: {dateTo.ToString()}</p>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {dateFrom != null && (
                                    <>
                                        <p>Setted date: {dateFrom.ToString()}</p>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}

                <div className="d-flex justify-content-center">
                    {saving && (<LoadingStatus error={savingError} errorText={"Something went wrong, try again"} loadingText={"Saving update"} />)}
                    {savingStatus != null && (<h5>{savingStatus}</h5>)}
                </div>

                <button type='button' className="btn btn-success" onClick={handleSave}>Save</button>

            </div>
        </>
    )
}
export default Visitation;