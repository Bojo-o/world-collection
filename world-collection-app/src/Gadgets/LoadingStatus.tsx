export interface LoadingStatusProps{
    error : boolean;
    errorText : string;
    loadingText : string;
}
function LoadingStatus({error,loadingText,errorText} : LoadingStatusProps){
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