import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourseCategories } from '../../../../services/operations/courseDetailsAPI'
import { categories } from '../../../../services/apis'

const CourseInformationForm = () => {

  const {
    register,
    handleSubmit,
    setValue,
    getValue,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      if (categories.length > 0) {
        setCourseCategories(categories)
      }
      setLoading(false)
    }

    if (editCourse) {
      setValue("CourseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("CoursePrice", course.price)
      setValue("CourseTags", course.tag)
      setValue("CourseBenifits", course.whatYouWillLearn)
      setValue("CourseCategories", course.category)
      setValue("CourseRequirements", course.instructions)
      setValue("CourseImage", course.thumbnail)
    }

    getCategories()

  }, [])

  const onSubmit = async (data) => {

  }

  console.log("Printing course categories", courseCategories)

  return (
    <form onSubmit={handleSubmit(onSubmit)}
      className='rounded-md border-richblue-700 bg-richblue-800 p-6 space-y-8'>
      <div>
        <label>Course Title <sup>*</sup></label>
        <input
          id='courseTitle'
          placeholder='Enter course Title'
          {...register("courseTitle", { required: true })}
          className='w-full'
        />
        {
          errors.courseTitle && (
            <span>course Title is required</span>
          )
        }
      </div>

      <div>
        <label>Course Short Description <sup>*</sup></label>
        <input
          id='courseShortDscription'
          placeholder='Enter Description'
          {...register("courseShortDesc", { required: true })}
          className='min-h-[140px] w-full'
        />
        {
          errors.courseTitle && (
            <span>course description is required</span>
          )
        }
      </div>

      <div className='relative'>
        <label>Course Price <sup>*</sup></label>
        <input
          id='coursePrice'
          placeholder='Enter Course Price'
          {...register("coursePrice", {
            required: true,
            valueAsNumber: true,
          })}
          className='w-full'
        />
        <span className='absolute'>Rs</span>
        {
          errors.courseTitle && (
            <span>course description is required</span>
          )
        }
      </div>

      <div>
        <label>Course Category</label>
        <selectct
          id="courseCategory"
          defaultValue=""
          {...register("courseCategory", { required: true })}
        >
          <option value="" disabled> Choose a category</option>
          {
            !loading && courseCategories.map((category, index) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))
          }

        </selectct>
        {
          errors.courseCategory && (
            <span>
              Course category is required
            </span>
          )
        }
      </div>

      {/* Create a custom component for handdling tags input */}

      {/* create a component for uplaoding and showing preview of media or thumbnail*/}

      {/* <Upload 
         
      /> */}

      <div>
        <label>Benefits of Course <sup>*</sup></label>
        <input
          id='courseBenefits'
          placeholder='Enter Benifits of Course'
          {...register("courseBenifits", { required: true })}
          className='min-h-[140px] w-full'
        />
        {
          errors.courseTitle && (
            <span>course benefits is required</span>
          )
        }
      </div>

    </form>
  )
}

export default CourseInformationForm