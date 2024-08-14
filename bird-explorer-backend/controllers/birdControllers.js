import Bird from "../models/birdModel.js";

const birdController = {
  async getAll(req, res) {
    const birds = await Bird.findAll({
      order: ["position", "ASC"],
    });
    res.json(birds);
  },

  async getOne(req, res) {
    const bird = await Bird.findByPk(req.params.id);
  },
};

export default birdController;
