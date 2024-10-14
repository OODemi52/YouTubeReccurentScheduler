"use client";
import { useState, useEffect } from "react";

import { generateResources, generateAppointments } from "../../utils/fakeData";

import Planner from "@/components/planner/Planner";
import { Appointment, Resource } from "@/models";

export default function AboutPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const initResources = generateResources(4); // Generate 4 resources
    const initAppointments = generateAppointments(100, initResources); // Generate 100 appointments linked to the resources

    console.log("Generated Resources:", initResources); // Log generated resources
    console.log("Generated Appointments:", initAppointments); // Log generated appointments

    setResources(initResources);
    setAppointments(initAppointments);
  }, []);

  useEffect(() => {
    console.log("Updated Appointments:", appointments); // Log updated appointments
  }, [appointments]); // Add appointments as a dependency

  return (
    <Planner initialAppointments={appointments} initialResources={resources} />
  );
}