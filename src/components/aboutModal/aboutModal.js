import React from 'react';
import PropTypes from 'prop-types';

import { AboutModal as PfAboutModal, TextContent, TextList, TextListItem, Button } from '@patternfly/react-core';

import { detect } from 'detect-browser';
import redHatLogo from '../../img/Logo-RedHat-A-Reverse-RGB.svg';
import managedIntegrationLogo from '../../img/Logo-Red_Hat-Managed_Integration-A-Reverse-RGB.svg';
import pfBackgroundImage from '../../img/PF4DownstreamBG.svg';

// MF052120 - Testing RHMI config service
import { getCurrentRhmiConfig, updateRhmiConfig } from '../../services/rhmiConfigServices';

const pkgJson = require('../../../package.json');

class AboutModal extends React.Component {
  constructor(props) {
    super(props);

    if (window.OPENSHIFT_CONFIG && window.OPENSHIFT_CONFIG.openshiftVersion === 3) {
      this.state = {
        config: {
          apiVersion: 'integreatly.org/v1alpha1',
          kind: 'RHMIConfig',
          metadata: {
            creationTimestamp: '2020-05-18T20:45:36Z',
            generation: 1,
            name: 'rhmi-config',
            namespace: 'redhat-rhmi-operator',
            resourceVersion: '37138',
            selfLink: '/apis/integreatly.org/v1alpha1/namespaces/redhat-rhmi-operator/rhmiconfigs/rhmi-config',
            uid: 'b6063850-6598-483e-9e91-5dfde651b581'
          },
          spec: {
            backup: {},
            maintenance: {},
            upgrade: {
              alwaysImmediately: false,
              duringNextMaintenance: false
            }
          }
        }
      };
    } else {
      this.state = {
        config: {
          apiVersion: '',
          kind: '',
          metadata: {
            creationTimestamp: '',
            generation: '',
            name: '',
            namespace: '',
            resourceVersion: '',
            selfLink: '',
            uid: ''
          },
          spec: {
            backup: {},
            maintenance: {},
            upgrade: {
              alwaysImmediately: false,
              duringNextMaintenance: false
            }
          }
        }
      };
    }
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

  changeGenerationMockValue = value => {
    this.setState({
      config: {
        ...this.state.config,
        metadata: {
          ...this.state.config.metadata,
          generation: value
        }
      }
    });
  };

  changeGenerationValue = value => {
    this.setState(
      {
        config: {
          ...this.state.config,
          metadata: {
            ...this.state.config.metadata,
            generation: value
          }
        }
      },
      () => updateRhmiConfig(this.state.config)
    );
  };

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
                <TextListItem component="dt">&nbsp;</TextListItem>
                <TextListItem component="dd">{}</TextListItem>
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
                <TextListItem component="dt"> </TextListItem>
                <TextListItem component="dd">{}</TextListItem>
              </TextList>
            ) : (
              ' '
            )}
          </TextContent>
          <TextContent>
            <TextList component="dl">
              <TextListItem component="dt">&nbsp;</TextListItem>
              <TextListItem component="dd">{}</TextListItem>
            </TextList>
          </TextContent>
          <Button
            id="settings-save-button"
            variant="primary"
            type="button"
            onClick={() => this.changeGenerationValue(this.state.config.metadata.generation + 1)}
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
