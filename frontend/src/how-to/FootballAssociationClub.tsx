export const FootballAssociationClub = () => {
    return (
        <div 
            style={{
                fontSize: "0.8rem"
            }}
        >
            {/* https://fulltime.thefa.com/home/club/165942503.html */}
            <h3>
                How to get club ID from Football Association website
            </h3>
            <p>
                <b>1.</b> Go to the <a href='https://fulltime.thefa.com/home/index.html' target='_'>FA website</a>
            </p>
            <p>
                <b>2.</b> Search for your club in the 'Find your league or club' section
            </p>
            <p>
                <b>3.</b> Once you're on your club's page, the URL should look something like this: <i>https://fulltime.thefa.com/home/club/182317005.html</i>
            </p>
            <p>
                <b>4.</b> Copy the club ID from the URL into the entry box, in the example above it is 182317005
            </p>
        </div>
    )
}