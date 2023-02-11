'use strict';

/**
 * `is-admin` policy
 */

module.exports = (policyContext, config, { strapi }) => {
    // Add your own logic here.
    strapi.log.info('In check-role policy.');

    const { userRole } = config;

  console.log('strapi', strapi)

    const isEligible = policyContext.state.user && policyContext.state.user.role.name === userRole;

    if (isEligible) {
      return true;
    }

    return false;
};
