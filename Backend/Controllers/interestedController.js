const User = require('./../Models/userModel.js');
const Property = require('./../Models/propertyModel.js');
const { PropertyInterest } = require('./../Models/interestedModel.js');
const { default: queryModifier } = require('./../Utils/queryModifier');
const { s3Get } = require('../Utils/s3Tools.js');
const { SendEmail } = require('./../Utils/emailService.js');
const CustomError = require('./../Utils/customError.js');

async function getPropertyImages(property) {
  const propertyImageKeys = Object.keys(property.images);
  const imageUrls = await Promise.all(
    propertyImageKeys.map(async (imageKey, index) => {
      try {
        console.log(property.images[imageKey]);
        const imageUrl = await s3Get(property.images[imageKey]);
        return imageUrl;
      } catch (error) {
        return null;
      }
    })
  );
  const images = {};
  imageUrls.forEach((el, ind) => {
    images[`image${ind + 1}`] = el;
  });
  property.images = images;
  return property;
}

exports.registerInterest = async (req, res, next) => {
  try {
    if (!req.body.propertyId) {
      throw new CustomError.default(
        'Unprocessable Entity',
        'No propertyId supplied',
        422
      );
    }
    let property = {};
    let owner = {};
    try {
      property = await Property.findById(req.body.propertyId);
      owner = await User.findById(property.owner_id);
    } catch (error) {
      throw new CustomError.default(
        'Not Acceptable',
        'Failed to find property',
        406
      );
    }

    try {
      const newInterest = await PropertyInterest.create({
        propertyID: property.id,
        interestedUserID: req.user.id,
        propertyOwnerID: owner._id,
      });
      res.status(201).json({
        status: 'Created',
        success: true,
        message: 'successfully registered interest',
        data: {
          interest: newInterest,
        },
      });
    } catch (error) {
      throw new CustomError.default(
        'Bad Request',
        'failed to make new interest',
        400
      );
    }
  } catch (error) {
    res.status(error.errorCode || 500).json({
      status: error.customMessage || 'Internal Server Error Error',
      success: false,
      message: error.statusMessage || 'Something Went Wrong on Our End',
      data: error.data || {},
    });
  }
};

exports.getInterests = async (req, res, next) => {
  try {
    const query = new queryModifier(
      PropertyInterest.find({ interestedUserID: req.user._id }),
      req.query
    ).pagination();
    const myinterests = await query.queryObject;
    const interestswithdetails = await Promise.all(
      myinterests.map(async (doc) => {
        let propertyDetails = await Property.findById(doc.propertyID);
        propertyDetails = await getPropertyImages(propertyDetails);
        return (newDoc = { ...doc._doc, propertyDetails: propertyDetails });
      })
    );
    const totalCount = await PropertyInterest.countDocuments({
      interestedUserID: req.user._id,
    });
    res.status(200).json({
      status: 'OK',
      success: true,
      results: interestswithdetails.length,
      totalCount: totalCount || 0,
      data: {
        interests: interestswithdetails,
      },
    });
  } catch (error) {
    res.status(error.errorCode || 500).json({
      status: error.customMessage || 'Internal Server Error Error',
      success: false,
      message: error.statusMessage || 'Something Went Wrong on Our End',
      data: error.data || {},
    });
  }
};

exports.getInterestedUsersOfProperty = async (req, res, next) => {
  try {
    const query = new queryModifier(
      PropertyInterest.find({
        propertyOwnerID: req.user._id,
        propertyID: req.query.propertyId,
      }),
      req.query
    );

    const interestestsOnAProperty = await query.queryObject;

    let interestedData = await Promise.all(
      interestestsOnAProperty.map(async (doc) => {
        let user = await User.findById(doc.interestedUserID).select(
          'name avatar description'
        );
        return {
          interest: {
            id: doc._id,
            interestStatus: doc.interestStatus,
          },
          user,
        };
      })
    );
    const propertyData = await Property.findById(req.query.propertyId).select(
      'name'
    );
    res.status(200).json({
      status: 'OK',
      success: true,
      results: interestedData.length,
      data: {
        property: propertyData,
        interestData: interestedData,
      },
    });
  } catch (error) {
    res.status(error.errorCode || 500).json({
      status: error.customMessage || 'Internal Server Error Error',
      success: false,
      message: error.statusMessage || 'Something Went Wrong on Our End',
      data: error.data || {},
    });
  }
};

exports.getInterestsOnProperties = async (req, res, next) => {
  try {
    const query = new queryModifier(
      PropertyInterest.find({ propertyOwnerID: req.user._id }).sort({
        interestStatus: 1,
      }),
      req.query
    ).pagination();
    const interestsOnMyProperties = await query.queryObject;

    Object.keys(interestsOnMyProperties).forEach((key) => {
      console.log(interestsOnMyProperties[key].interestStatus);
    });

    let detailedinterests = await Promise.all(
      interestsOnMyProperties.map(async (doc) => {
        let propertyInfo = await Property.findById(doc.propertyID).select({
          images: { image1: 1 },
          id: 1,
          price: 1,
          name: 1,
          address: 1,
        });
        let userInfo = await User.findById(doc.interestedUserID).select(
          'name avatar description'
        );
        userInfo.avatar = await s3Get(userInfo.avatar);
        if (propertyInfo && propertyInfo.images) {
          propertyInfo.images.image1 = await s3Get(propertyInfo.images.image1);
        }
        return {
          ...doc._doc,
          propertyDetails: propertyInfo,
          userDetails: userInfo,
        };
      })
    );
    const totalCount = await PropertyInterest.countDocuments({
      propertyOwnerID: req.user._id,
    });
    res.status(200).json({
      status: 'OK',
      success: true,
      totalCount: totalCount || 0,
      results: detailedinterests.length,
      data: {
        interests: detailedinterests,
      },
    });
  } catch (error) {
    res.status(error.errorCode || 500).json({
      status: error.customMessage || 'Internal Server Error Error',
      success: false,
      message: error.statusMessage || 'Something Went Wrong on Our End',
      data: error.data || {},
    });
  }
};

exports.sendInviteToInterestedUser = async (req, res, next) => {
  try {
    if (!req.body.interestId) {
      throw new CustomError.default(
        'Unprocessable Entity',
        'Incorrect data supplied',
        422
      );
    }
    let propertyInterest = {};
    try {
      propertyInterest = await PropertyInterest.findOne({
        _id: req.body.interestId,
      });
      if (!propertyInterest) {
        throw new CustomError.default(
          'Not Acceptable',
          'No Property of that id found',
          406
        );
      }
    } catch (error) {
      throw error;
    }
    if (req.user.id != propertyInterest.propertyOwnerID) {
      throw new CustomError.default(
        'Not Authorized',
        'You are not the owner of this property',
        401
      );
    }
    const interesteduser = await User.findById(
      propertyInterest.interestedUserID
    );
    if (!interesteduser) {
      throw new CustomError.default(
        'Not Acceptable',
        'Interested User no longer exists',
        406
      );
    }
    const property = await Property.findById(propertyInterest.propertyID);
    if (!property) {
      throw new CustomError.default(
        'Not Acceptable',
        'Property no longer exists',
        406
      );
    }
    const inviteParameters = {
      target: interesteduser.email,
      subject: 'Property Interest Invitation',
      text: `You have been invited to get in contact with the owner of a property, here is the owners email address: ${req.user.email}`,
      html: `<h1>Hooray! New Property Viewing Invite!</h1><br/>
			<p>You have been invited to get in touch with the owner of a property you were interested in, here is the owners email address: ${
        req.user.email
      }</p><br/>
			<h2>PropertyDetails</h2>
			<p>Property Name: ${property.name}</p>
			<p>Address \n: ${[
        property.address.addressLine1,
        property.address.addressLine2,
        property.address.city,
        property.address.county,
        property.address.postcode,
      ].join('\n, ')}</p>
			<br/>
			<h2>Link to Property<h2>
			<a href="http://127.0.0.1:3000/api/properties/propertyByID?propertyId=${
        property._id
      }">The Property</a>
			<br/>
			`,
    };
    SendEmail(inviteParameters);
    propertyInterest.interestStatus = 1;
    propertyInterest.save();
    res.status(200).json({
      status: 'OK',
      success: true,
      message: 'successfully sent email to interested user',
      data: {},
    });
  } catch (error) {
    res.status(error.errorCode || 500).json({
      status: error.customMessage || 'Internal Server Error Error',
      success: false,
      message: error.statusMessage || 'Something Went Wrong on Our End',
      data: error.data || {},
    });
  }
};

exports.rejectInterest = async (req, res, next) => {
  try {
    if (!req.body.interestId) {
      throw new CustomError.default(
        'Bad Request',
        'No interestId supplied',
        400
      );
    }
    const propertyInterest = await PropertyInterest.findOne({
      _id: req.body.interestId,
    }).select({ interestedUserID: 1, propertyID: 1 });
    if (!propertyInterest) {
      throw new CustomError.default(
        'Not Acceptable',
        'No PropertyInterest of that id found',
        406
      );
    }
    const property = await Property.findById(
      propertyInterest.propertyID
    ).select({
      name: 1,
    });
    if (!property) {
      throw new CustomError.default(
        'Not Acceptable',
        'No Property of that id found',
        406
      );
    }
    const interesteduser = await User.findById(
      propertyInterest.interestedUserID
    ).select({ email: 1 });
    if (!interesteduser) {
      throw new CustomError.default(
        'Not Acceptable',
        'Interested User no longer exists that id found',
        406
      );
    }
    const rejectionParameters = {
      target: interesteduser.email,
      subject: 'Property Interest Rejection',
      text: `Looks like you weren't a match, but keep looking! Your interest invitation was rejected by the owner on ${property.name}`,
      html: `<h1>Looks like you weren't a match, but keep looking!</h1><br/>
			<p>Your interest invitation was rejected by the owner on ${property.name}. Don't give up, continue your search on Face2Face</p>
			`,
    };
    SendEmail(rejectionParameters);
    propertyInterest.interestStatus = 2;
    propertyInterest.save();
    res.status(200).json({
      status: 'Ok',
      success: true,
      message: 'Rejection has been sent',
      data: {},
    });
  } catch (error) {
    res.status(error.errorCode || 500).json({
      status: error.customMessage || 'Internal Server Error Error',
      success: false,
      message: error.statusMessage || 'Something Went Wrong on Our End',
      data: error.data || {},
    });
  }
};
