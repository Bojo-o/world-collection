/**
 * Props necessary for LoadingStatus.
 */
export interface LoadingStatusProps {
    /** Flag if error occurs. */
    error: boolean;
    /** Text of error, if error occurs, it will show this text. */
    errorText: string;
    /** Text, which is showed during loading. */
    loadingText: string;
}
/**
 * Helping func for rendering loading status, when user have to wait for some action to be done.
 * If loading was unsuccesful meaning some error ocurred during loading, it shows error text.
 * @param LoadingStatusProps See LoadingStatusProps description.
 * @returns JSX element rendering loading status or error text.
 */
function LoadingStatus({ error, loadingText, errorText }: LoadingStatusProps) {
    return (
        <>
            {error ? (
                <>
                    <h4>{errorText}</h4>
                </>
            ) : (
                <>
                    <div className="d-flex flex-row">
                        <h4>{loadingText}</h4>
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
export default LoadingStatus