import React from 'react'; // eslint-disable-line no-unused-vars

const Links = ({ links }) => {
  if (!(links && links.length)) {
    return null;
  }
  return <div className="Data-row">
    <div>Links</div>
    <div>
      <ul>
        {links.map(l => <li key={l.url}>
          <a href={l.url} target="_blank"
            rel="noopener noreferrer">
            {l.text || l.url}
          </a>
        </li>)}
      </ul>
    </div>
  </div>;
};

export default Links;
