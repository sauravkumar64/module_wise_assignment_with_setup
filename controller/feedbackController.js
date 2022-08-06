const Service = require("../service");

module.exports = {
  createFeed: async (req, res) => {
    console.log(req);
    let data = {
      comment: req.comment,
      rating: req.rating,
      uId: req.uId,
    };
    console.log(data);
    const create = await Service.feedbackService.addFeed(data);
    try {
      if (create) {
        return {
          status: 200,
          msg: `FeedBack Added successfull, ${create}`,
        };
      }
    } catch (error) {
      return {
        status: 401,
        msg: `Something went wrong ${error.message}`,
      };
    }
  },

  getParticularFeedBack: async (req, res) => {
    let data = {
      id: req.id,
    };
    const getFeed = await Service.feedbackService.findFeed(data);
    try {
      if (getFeed) {
        return {
          status: 200,
          msg: "Successfully!!",
          getFeed: getFeed,
        };
      }
    } catch (error) {
      return {
        status: 400,
        msg: "Something went wrong",
        error: error,
      };
    }
  },

  DeleteFeed: async (req, res) => {
    const obj = {
      id: req.id,
    };
    const get = await Service.feedbackService.findFeedBack(obj);

    if (get) {
      const deleteFeed = await Service.feedbackService.deleteFeed(obj);
      res
        .status(200)
        .json({ message: "Deletion successfull", details: deleteFeed });
    } else {
      res
        .status(401)
        .send(
          "FeedBack not found, Access Denied Or You Are Not Autherized to delete."
        );
    }
  },
  getcomment: async (req, res) => {
    const get = await Service.feedbackService.getcomment();
    return get;
  },
  getratting: async (req, res) => {
    console.log(req);
    const data = {
      rating: req.rating,
    };

    const gets = await Service.feedbackService.getratting(data);
    console.log(gets);
    return gets;
  },
};
