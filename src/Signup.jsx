import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // For icons

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log('Signup attempt:', { username, email, password });
        // Implement your signup logic here
    };

    return (
        <div className="auth-page-wrapper"> {/* Custom wrapper for background/centering */}
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Row className="w-100">
                    <Col md={8} lg={6} xl={5} className="mx-auto">
                        <Card className="shadow-lg p-4 custom-card-signup"> {/* Custom card class */}
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <h2 className="card-title-custom">Join Us!</h2>
                                    <p className="text-muted">Create your account</p>
                                </div>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicUsername">
                                        <InputGroup className="input-group-custom">
                                            <InputGroup.Text className="input-icon-bg"><FaUser /></InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                                className="form-control-custom"
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <InputGroup className="input-group-custom">
                                            <InputGroup.Text className="input-icon-bg"><FaEnvelope /></InputGroup.Text>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="form-control-custom"
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <InputGroup className="input-group-custom">
                                            <InputGroup.Text className="input-icon-bg"><FaLock /></InputGroup.Text>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="form-control-custom"
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                                        <InputGroup className="input-group-custom">
                                            <InputGroup.Text className="input-icon-bg"><FaLock /></InputGroup.Text>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="form-control-custom"
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <div className="d-grid gap-2 mb-3">
                                        <Button variant="primary" type="submit" className="btn-custom-primary">
                                            Sign Up
                                        </Button>
                                    </div>

                                    <hr className="my-4" />
                                    <div className="text-center">
                                        Already have an account? <a href="/login" className="text-decoration-none">Login</a>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Signup;