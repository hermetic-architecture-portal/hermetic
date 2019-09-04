import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import Links from '../shared/Links';

class DataEntity extends React.Component {
  async componentDidMount() {
    modelStore.loadDataEntityDetail(this.props.dataEntityId);
  }

  render() {
    const { dataEntityId } = this.props;
    const entity = modelStore.dataEntityDetails.find(d => d.dataEntityId === dataEntityId);
    if (!entity) {
      return null;
    }

    const childEntitiesJsx = entity.childEntities.map(child => (
      <li key={child.dataEntityId}>
        <Link to={`/entity/${child.dataEntityId}`}>
          {child.name}
        </Link>
      </li>
    ));

    const technologiesJsx = entity.technologies
      .sort((a, b) => a.role.rank - b.role.rank)
      .map((t) => {
        const className = (t.role.rank === 1) ? 'Data-access-owner' : undefined;
        return <tr className={className} key={t.technologyId}>
          <td>{t.role.name}</td>
          <td>
            <Link to={`/technology/${t.technologyId}`}>
              {t.technologyName}
            </Link>
          </td>
          <td>{t.description}</td>
        </tr>;
      });

    return <div>
        <div className="Single-col-wrapper">
        <div className="Head-1">{entity.name}</div>
        { !entity.description ? undefined
          : <div className="Data-single-row">{entity.description}</div>}
        <Links links={entity.links} />
        { !entity.parentEntity ? undefined
          : <div className="Data-row">
            <div>Parent Entity</div>
            <div>
              <Link to={`/entity/${entity.parentEntity.dataEntityId}`}>
                {entity.parentEntity.name}
              </Link>
            </div>
          </div>}
        { !childEntitiesJsx.length ? undefined
          : <div className="Data-row">
              <div>Child Entities</div>
              <div>
                <ul>
                  {childEntitiesJsx}
                </ul>
              </div>
            </div>}
        { !technologiesJsx.length ? undefined
          : <div className="Data-row">
              <div>Ownership</div>
              <div>
                <table>
                  <thead><tr><th>Role</th><th>Application</th><th>Description</th></tr></thead>
                  <tbody>
                    {technologiesJsx}
                  </tbody>
                </table>
              </div>
            </div>}
      </div>
    </div>;
  }
}

export default observer(DataEntity);
