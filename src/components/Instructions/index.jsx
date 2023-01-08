import './styles.css';

const Instructions = () => (
  <div className="instructions-container">
    <span className="instructions-title">Instructions</span>
    <span className="instruction">
      This code sample covers how to retrieve and apply the &quot;attributeSelector&quot; filter
    </span>
    <span className="instruction">
      1) Select the &quot;attributeSelector&quot; filter you want to modify
    </span>
    <span className="instruction">2) Change the values you want to modify in each filter</span>
    <span className="instruction">
      For more information on using filters, visit &nbsp;
      <a
        href="https://microstrategy.github.io/embedding-sdk-docs/add-functionality/filters"
        target="_blank"
        rel="noreferrer">
        documentation.
      </a>
    </span>
  </div>
);

export default Instructions;
