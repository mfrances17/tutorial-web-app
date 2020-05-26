import React from 'react';
import PropTypes from 'prop-types';

import { AboutModal as PfAboutModal, TextContent, TextList, TextListItem, Button } from '@patternfly/react-core';

import { detect } from 'detect-browser';
import redHatLogo from '../../img/Logo-RedHat-A-Reverse-RGB.svg';
import managedIntegrationLogo from '../../img/Logo-Red_Hat-Managed_Integration-A-Reverse-RGB.svg';
import pfBackgroundImage from '../../img/PF4DownstreamBG.svg';

// MF052120 - Testing RHMI config service
import { getCurrentRhmiConfig, updateRhmiConfig } from '../../services/rhmiConfigServices';
// import { getCurrentRhmiConfig, updateRhmiConfig } from '../../services/rhmiConfigServices';

const pkgJson = require('../../../package.json');

class AboutModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { config: {} };
  }

  componentDidMount() {
    getCurrentRhmiConfig()
      .then(response => {
        if (response) {
          this.setState({
            config: response
          });
        }
      })
      .catch(error => console.log(`ERROR: The error is: ${error}`));
  }

  // change = (value) => {
  //   updateRhmiConfig(this.state.);
  // };

  getLogo = () => {
    let clusterType = '';
    let logoName = '';
    if (window.OPENSHIFT_CONFIG) {
      clusterType = window.OPENSHIFT_CONFIG.mockData ? 'localhost' : window.OPENSHIFT_CONFIG.clusterType;
      if (clusterType === 'poc') {
        logoName = managedIntegrationLogo;
      } else if (clusterType === 'osd') {
        logoName = managedIntegrationLogo;
      } else {
        logoName = redHatLogo;
      }
    }
    return logoName;
  };

  render() {
    const { isOpen, closeAboutModal } = this.props;
    const browser = detect();

    const rhmiConfig = this.state.config;
    console.log(rhmiConfig);

    const urlParts = window.location.host.split('.');
    const [, , clusterId] = urlParts;

    return (
      <React.Fragment>
        <PfAboutModal
          isOpen={isOpen}
          onClose={closeAboutModal}
          productName="Red Hat Solution Explorer"
          brandImageSrc={this.getLogo()}
          brandImageAlt="Red Hat logo"
          backgroundImageSrc={pfBackgroundImage}
        >
          <TextContent>
            <TextList component="dl">
              <TextListItem component="dt">RHMI Version</TextListItem>
              <TextListItem component="dd">
                {window.OPENSHIFT_CONFIG ? window.OPENSHIFT_CONFIG.integreatlyVersion : ' '}
              </TextListItem>
              <TextListItem component="dt">Console Version</TextListItem>
              <TextListItem component="dd">{pkgJson.version}</TextListItem>
              <TextListItem component="dt">Cluster Name</TextListItem>
              <TextListItem component="dd">{clusterId}</TextListItem>
              <TextListItem component="dt">User Name</TextListItem>
              <TextListItem component="dd">{window.localStorage.getItem('currentUserName')}</TextListItem>
              <TextListItem component="dt">Browser Version</TextListItem>
              <TextListItem component="dd">
                {browser ? browser.name : ' '} {browser ? browser.version : ' '}
              </TextListItem>
              <TextListItem component="dt">Browser OS</TextListItem>
              <TextListItem component="dd">{browser ? browser.os : ' '}</TextListItem>
              {/* MF052120 - TESTING RHMI CONFIG SERVICE */}
            </TextList>
            {JSON.stringify(rhmiConfig) !== '{}' ? (
              <TextList component="dl">
                <TextListItem component="dt">RHMI Config</TextListItem>
                <TextListItem component="dd">{}</TextListItem>
                <TextListItem component="dt">API Version:</TextListItem>
                <TextListItem component="dd">{rhmiConfig.apiVersion}</TextListItem>
                <TextListItem component="dt">Kind:</TextListItem>
                <TextListItem component="dd">{rhmiConfig.kind}</TextListItem>
                <TextListItem component="dt">RHMI Config Metadata</TextListItem>
                <TextListItem component="dd">{}</TextListItem>
                <TextListItem component="dt">Creation timestamp:</TextListItem>
                <TextListItem component="dd">{rhmiConfig.metadata.creationTimestamp}</TextListItem>
                <TextListItem component="dt">Generation:</TextListItem>
                <TextListItem component="dd">{rhmiConfig.metadata.generation}</TextListItem>
                <TextListItem component="dt">Name</TextListItem>
                <TextListItem component="dd">{rhmiConfig.metadata.name}</TextListItem>
                <TextListItem component="dt">Namespace</TextListItem>
                <TextListItem component="dd">{rhmiConfig.metadata.namespace}</TextListItem>
                <TextListItem component="dt">Resource Version</TextListItem>
                <TextListItem component="dd">{rhmiConfig.metadata.resourceVersion}</TextListItem>
                <TextListItem component="dt">Upgrade spec</TextListItem>
                <TextListItem component="dd">{}</TextListItem>
                <TextListItem component="dt">Always immediately:</TextListItem>
                <TextListItem component="dd">{rhmiConfig.spec.upgrade.alwaysImmediately.toString()}</TextListItem>
                <TextListItem component="dt">During next maintenance:</TextListItem>
                <TextListItem component="dd">{rhmiConfig.spec.upgrade.duringNextMaintenance.toString()}</TextListItem>
              </TextList>
            ) : (
              ' '
            )}
          </TextContent>
          <Button 
          id="settings-save-button" variant="primary" type="button" 
          // onClick={e => this.change(e, value)}
          >
            Change
          </Button>{' '}
        </PfAboutModal>
      </React.Fragment>
    );
  }
}

AboutModal.propTypes = {
  isOpen: PropTypes.bool,
  closeAboutModal: PropTypes.func
};

AboutModal.defaultProps = {
  isOpen: false,
  closeAboutModal: null
};

export { AboutModal as default, AboutModal };
