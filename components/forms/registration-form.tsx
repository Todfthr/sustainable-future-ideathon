"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/context/language-context"
import { User, Users, Lightbulb, FileText, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { RegistrationData } from "@/lib/validations/registration"
import { toast } from "sonner"

interface TeamMember {
  name: string
  email: string
  phone: string
  role: string
}

interface FormData {
  // Leader Details
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  collegeName: string
  organizationType: "student" | "entrepreneur" | "msme" | ""

  // Team Details
  teamSize: number
  teamName: string
  teamMembers: TeamMember[]

  // Theme and Idea
  selectedTheme: string
  ideaTitle: string
  ideaDescription: string
  problemStatement: string
  proposedSolution: string
  expectedImpact: string

  // Additional
  previousExperience: string
  whyThisTheme: string
  agreeToTerms: boolean
}

const themes = [
  { value: "sustainable-fashion", label: "Sustainable Fashion", icon: "👗" },
  { value: "sustainable-food", label: "Sustainable Food & Nutrition", icon: "🌱" },
  { value: "sustainable-tourism", label: "Sustainable Tourism", icon: "🌍" },
  { value: "plastic-waste", label: "Combating Plastic Waste", icon: "♻️" },
  { value: "circular-economy", label: "Circular Economy", icon: "🔄" },
]

export default function RegistrationForm() {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    leaderName: "",
    leaderEmail: "",
    leaderPhone: "",
    collegeName: "",
    organizationType: "",
    teamSize: 1,
    teamName: "",
    teamMembers: [],
    selectedTheme: "",
    ideaTitle: "",
    ideaDescription: "",
    problemStatement: "",
    proposedSolution: "",
    expectedImpact: "",
    previousExperience: "",
    whyThisTheme: "",
    agreeToTerms: false,
  })

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...formData.teamMembers]
    if (!updatedMembers[index]) {
      updatedMembers[index] = { name: "", email: "", phone: "", role: "" }
    }
    updatedMembers[index][field] = value
    updateFormData("teamMembers", updatedMembers)
  }

  const handleTeamSizeChange = (size: number) => {
    updateFormData("teamSize", size)
    // Initialize team members array based on size (excluding leader)
    const membersNeeded = size - 1
    const newMembers: TeamMember[] = Array(membersNeeded)
      .fill(null)
      .map(() => ({
        name: "",
        email: "",
        phone: "",
        role: "",
      }))
    updateFormData("teamMembers", newMembers)
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.leaderName &&
          formData.leaderEmail &&
          formData.leaderPhone &&
          formData.collegeName &&
          formData.organizationType
        )
      case 2:
        if (formData.teamSize === 1) return !!formData.teamName
        return !!(
          formData.teamName && formData.teamMembers.every((member) => member.name && member.email && member.phone)
        )
      case 3:
        return !!formData.selectedTheme
      case 4:
        return !!(
          formData.ideaTitle &&
          formData.ideaDescription &&
          formData.problemStatement &&
          formData.proposedSolution &&
          formData.expectedImpact &&
          formData.agreeToTerms
        )
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

 const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const registrationData: RegistrationData = {
        leaderName: formData.leaderName,
        leaderEmail: formData.leaderEmail,
        leaderPhone: formData.leaderPhone,
        collegeName: formData.collegeName,
        organizationType: formData.organizationType as "student" | "entrepreneur" | "msme",
        teamSize: formData.teamSize,
        teamName: formData.teamName,
        teamMembers: formData.teamMembers,
        selectedTheme: formData.selectedTheme,
        ideaTitle: formData.ideaTitle,
        ideaDescription: formData.ideaDescription,
        problemStatement: formData.problemStatement,
        proposedSolution: formData.proposedSolution,
        expectedImpact: formData.expectedImpact,
        previousExperience: formData.previousExperience,
        whyThisTheme: formData.whyThisTheme,
        agreeToTerms: formData.agreeToTerms,
      }

      const result = await apiClient.register(registrationData)
      toast.success("Registration successful! Check email for confirmation.")
      console.log("Registration successful:", result)
      setCurrentStep(5) // Success step
    } catch (error) {
      console.error("Registration failed:", error)
        toast.error("Registration failed. Please try again.",
            {
                description: error instanceof Error ? error.message : "An unexpected error occurred.",
                duration: 5000,
            }
        )
      setSubmitError(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 4 && <div className={`w-12 h-1 mx-2 ${currentStep > step ? "bg-green-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <Card className="bg-white border-4 border-green-500 shadow-xl retro-card">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800 retro-heading">
          <User className="w-6 h-6 mr-2" />
          Personal Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leaderName" className="text-gray-700 font-semibold">
              Full Name *
            </Label>
            <Input
              id="leaderName"
              value={formData.leaderName}
              onChange={(e) => updateFormData("leaderName", e.target.value)}
              className="border-2 border-green-300 focus:border-green-500"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label htmlFor="leaderEmail" className="text-gray-700 font-semibold">
              Email Address *
            </Label>
            <Input
              id="leaderEmail"
              type="email"
              value={formData.leaderEmail}
              onChange={(e) => updateFormData("leaderEmail", e.target.value)}
              className="border-2 border-green-300 focus:border-green-500"
              placeholder="Enter email"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leaderPhone" className="text-gray-700 font-semibold">
              Phone Number *
            </Label>
            <Input
              id="leaderPhone"
              value={formData.leaderPhone}
              onChange={(e) => updateFormData("leaderPhone", e.target.value)}
              className="border-2 border-green-300 focus:border-green-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label htmlFor="collegeName" className="text-gray-700 font-semibold">
              College/Organization Name *
            </Label>
            <Input
              id="collegeName"
              value={formData.collegeName}
              onChange={(e) => updateFormData("collegeName", e.target.value)}
              className="border-2 border-green-300 focus:border-green-500"
              placeholder="Enter institution name"
            />
          </div>
        </div>

        <div>
          <Label className="text-gray-700 font-semibold">Organization Type *</Label>
          <RadioGroup
            value={formData.organizationType}
            onValueChange={(value) => updateFormData("organizationType", value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="entrepreneur" id="entrepreneur" />
              <Label htmlFor="entrepreneur">Entrepreneur</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="msme" id="msme" />
              <Label htmlFor="msme">MSME</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card className="bg-white border-4 border-green-500 shadow-xl retro-card">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800 retro-heading">
          <Users className="w-6 h-6 mr-2" />
          Team Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-gray-700 font-semibold">Team Size *</Label>
          <RadioGroup
            value={formData.teamSize.toString()}
            onValueChange={(value) => handleTeamSizeChange(Number.parseInt(value))}
            className="mt-2 grid grid-cols-4 gap-4"
          >
            {[1, 2, 3, 4].map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size.toString()} id={`size-${size}`} />
                <Label htmlFor={`size-${size}`}>
                  {size} {size === 1 ? "Member" : "Members"}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="teamName" className="text-gray-700 font-semibold">
            Team Name *
          </Label>
          <Input
            id="teamName"
            value={formData.teamName}
            onChange={(e) => updateFormData("teamName", e.target.value)}
            className="border-2 border-green-300 focus:border-green-500"
            placeholder="Enter team name"
          />
        </div>

        {formData.teamSize > 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Team Members</h3>
            {Array.from({ length: formData.teamSize - 1 }, (_, index) => (
              <Card key={index} className="border-2 border-green-300">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Member {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Name *</Label>
                      <Input
                        value={formData.teamMembers[index]?.name || ""}
                        onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                        className="border-2 border-green-200 focus:border-green-400"
                        placeholder="Member name"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Email *</Label>
                      <Input
                        type="email"
                        value={formData.teamMembers[index]?.email || ""}
                        onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                        className="border-2 border-green-200 focus:border-green-400"
                        placeholder="Member email"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Phone *</Label>
                      <Input
                        value={formData.teamMembers[index]?.phone || ""}
                        onChange={(e) => updateTeamMember(index, "phone", e.target.value)}
                        className="border-2 border-green-200 focus:border-green-400"
                        placeholder="Member phone"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Role</Label>
                      <Input
                        value={formData.teamMembers[index]?.role || ""}
                        onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                        className="border-2 border-green-200 focus:border-green-400"
                        placeholder="Role in team"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card className="bg-white border-4 border-green-500 shadow-xl retro-card">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800 retro-heading">
          <Lightbulb className="w-6 h-6 mr-2" />
          Theme Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-gray-700 font-semibold">Select Theme *</Label>
          <p className="text-sm text-gray-600 mb-4">Choose the theme that aligns with idea and passion</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((theme) => (
              <Card
                key={theme.value}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  formData.selectedTheme === theme.value
                    ? "border-green-600 bg-green-50"
                    : "border-green-300 hover:border-green-500"
                }`}
                onClick={() => updateFormData("selectedTheme", theme.value)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{theme.icon}</div>
                  <h3 className="font-semibold text-green-800">{theme.label}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {formData.selectedTheme && (
          <div>
            <Label htmlFor="whyThisTheme" className="text-gray-700 font-semibold">
              Why did you choose this theme?
            </Label>
            <Textarea
              id="whyThisTheme"
              value={formData.whyThisTheme}
              onChange={(e) => updateFormData("whyThisTheme", e.target.value)}
              className="border-2 border-green-300 focus:border-green-500"
              placeholder="Explain motivation for choosing this theme..."
              rows={3}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card className="bg-white border-4 border-green-500 shadow-xl retro-card">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800 retro-heading">
          <FileText className="w-6 h-6 mr-2" />
          Idea Submission
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="ideaTitle" className="text-gray-700 font-semibold">
            Idea Title *
          </Label>
          <Input
            id="ideaTitle"
            value={formData.ideaTitle}
            onChange={(e) => updateFormData("ideaTitle", e.target.value)}
            className="border-2 border-green-300 focus:border-green-500"
            placeholder="Give idea a catchy title"
          />
        </div>

        <div>
          <Label htmlFor="ideaDescription" className="text-gray-700 font-semibold">
            Idea Description *
          </Label>
          <Textarea
            id="ideaDescription"
            value={formData.ideaDescription}
            onChange={(e) => updateFormData("ideaDescription", e.target.value)}
            className="border-2 border-green-300 focus:border-green-500"
            placeholder="Provide a brief overview of idea..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="problemStatement" className="text-gray-700 font-semibold">
            Problem Statement *
          </Label>
          <Textarea
            id="problemStatement"
            value={formData.problemStatement}
            onChange={(e) => updateFormData("problemStatement", e.target.value)}
            className="border-2 border-green-300 focus:border-green-500"
            placeholder="What problem are you trying to solve?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="proposedSolution" className="text-gray-700 font-semibold">
            Proposed Solution *
          </Label>
          <Textarea
            id="proposedSolution"
            value={formData.proposedSolution}
            onChange={(e) => updateFormData("proposedSolution", e.target.value)}
            className="border-2 border-green-300 focus:border-green-500"
            placeholder="How will idea solve the problem?"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="expectedImpact" className="text-gray-700 font-semibold">
            Expected Impact *
          </Label>
          <Textarea
            id="expectedImpact"
            value={formData.expectedImpact}
            onChange={(e) => updateFormData("expectedImpact", e.target.value)}
            className="border-2 border-green-300 focus:border-green-500"
            placeholder="What impact do you expect solution to have?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="previousExperience" className="text-gray-700 font-semibold">
            Previous Experience (Optional)
          </Label>
          <Textarea
            id="previousExperience"
            value={formData.previousExperience}
            onChange={(e) => updateFormData("previousExperience", e.target.value)}
            className="border-2 border-green-300 focus:border-green-500"
            placeholder="Any relevant experience or background..."
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
          />
          <Label htmlFor="agreeToTerms" className="text-sm text-gray-700">
            I agree to the terms and conditions of the Sustainable Future Ideathon *
          </Label>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep5 = () => (
    <Card className="bg-white border-4 border-green-500 shadow-xl retro-card text-center">
      <CardContent className="p-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-green-800 mb-4 retro-heading">Registration Successful!</h2>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for registering for the Sustainable Future Ideathon. We've received submission and will contact
          you soon with further details.
        </p>
        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <p className="text-sm text-gray-600">
            <strong>What's Next?</strong>
            <br />• You'll receive a confirmation email shortly
            <br />• Keep an eye out for updates about the mentoring bootcamp
            <br />• Prepare for the presentation round if shortlisted
          </p>
        </div>
      </CardContent>
    </Card>
  )

  if (currentStep === 5) {
    return renderStep5()
  }

  return (
    <div className="space-y-8">
      {renderStepIndicator()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      <div className="flex justify-between">
        {currentStep > 1 && (
          <Button
            onClick={prevStep}
            variant="outline"
            className="border-2 border-green-500 text-green-600 hover:bg-green-50"
          >
            Previous
          </Button>
        )}

        <div className="ml-auto">
          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className="bg-green-600 hover:bg-green-700 text-white retro-button"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!validateStep(4) || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white retro-button"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
