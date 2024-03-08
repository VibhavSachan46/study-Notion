const Section = require("../models/Section");
const Course = require("../models/Course");
// CREATE a new section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		} 

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		// update coourse with section objectID
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
exports.updateSection = async (req, res) => {
	try {

		// get new data from user
		const { sectionName, sectionId } = req.body;

		// data validation
		if (!sectionName || !sectionId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		} 

		//update data
		const section = await Section.findByIdAndUpdate(
			sectionId, //jiske through change karna hai
			{ sectionName }, //kya change karna hai
			{ new: true } // return the uopdated data
		); 

		//return response
		res.status(200).json({
			success: true,
			message: section,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {
		//req.params -> test
		const { sectionId } = req.params;

		//delete the section with id
		await Section.findByIdAndDelete(sectionId);


		//Course ko bhi update karo


		// return response
		res.status(200).json({
			success: true,
			message: "Section deleted",
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};